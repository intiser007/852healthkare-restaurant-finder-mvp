// import { GoogleGenerativeAI } from '@google/generative-ai';
import { getMockHealthAssessment } from './mockHealthService';
import { RestaurantSuggestion, HealthAssessment, FoursquareVenue } from './types';
import { RestaurantService } from './restaurantService';

// Free LLM API configuration
const FREE_LLM_API_URL = 'https://mlvoca.com/api/generate';
const FREE_LLM_MODEL = 'deepseek-r1:1.5b'; // or 'tinyllama'

export const createRestaurantSuggestion = async (
  patientId: string,
  latitude: number,
  longitude: number
): Promise<RestaurantSuggestion[]> => {
  try {
    // Get user's health assessment
    const healthData = getMockHealthAssessment(patientId);
    
    // Get restaurant data from Foursquare API
    console.log('Environment check:');
    console.log('- FOURSQUARE_API_KEY exists:', !!process.env.FOURSQUARE_API_KEY);
    console.log('- FOURSQUARE_API_KEY length:', process.env.FOURSQUARE_API_KEY?.length);
    console.log('- FOURSQUARE_API_KEY first 10 chars:', process.env.FOURSQUARE_API_KEY?.substring(0, 10));
    console.log('- Using free LLM API from mlvoca.com');
    console.log('- Model: deepseek-r1:1.5b');
    const restaurantService = new RestaurantService(process.env.FOURSQUARE_API_KEY!);
    
    // Search for restaurants based on user preferences
    let restaurants: FoursquareVenue[] = [];
    
    if (healthData.nutrition?.cuisines && healthData.nutrition.cuisines.length > 0) {
      restaurants = await restaurantService.getRestaurantsByCategory(
        latitude,
        longitude,
        healthData.nutrition.cuisines
      );
    } else {
      restaurants = await restaurantService.searchRestaurants(latitude, longitude);
    }

    if (restaurants.length === 0) {
      return [];
    }

    // Use Gemini AI to analyze restaurants and provide personalized recommendations
    const restaurantData = restaurants.slice(0, 10).map(r => ({
      name: r.name,
      address: r.location.formatted_address,
      cuisine: r.categories.map(c => c.name).join(', '),
      rating: r.rating || 0,
      price: r.price ? '$'.repeat(r.price) : 'N/A',
      hours: r.hours?.display || 'Hours not available'
    }));

    const prompt = `You are a nutrition expert and restaurant recommendation assistant. Based on the user's health profile and the following restaurant data, provide personalized restaurant recommendations.

User Health Profile:
- Primary Goal: ${healthData.lifestyle.primaryGoal}
- Dietary Restrictions: ${healthData.nutrition?.restrictions?.join(', ') || 'None'}
- Allergies: ${healthData.nutrition?.allergies?.join(', ') || 'None'}
- Preferred Cuisines: ${healthData.nutrition?.cuisines?.join(', ') || 'Any'}

Available Restaurants:
${JSON.stringify(restaurantData, null, 2)}

Please analyze these restaurants and recommend the TOP 3-5 that best match the user's health goals and dietary requirements. For each recommendation, provide:
1. A clear justification explaining why this restaurant fits their health profile
2. A specific suggested dish that aligns with their goals and restrictions

Return your response as a valid JSON array with this exact structure:
[
  {
    "name": "Restaurant Name",
    "address": "Full Address",
    "cuisine": "Cuisine Type",
    "justification": "Detailed explanation of why this restaurant is recommended for their health goals",
    "suggestedDish": "Specific dish recommendation that fits their dietary needs"
  }
]

Important: 
- Consider their primary goal (weight loss, muscle gain, general health)
- Avoid restaurants/dishes that conflict with their restrictions or allergies
- Provide practical, actionable dish suggestions
- Focus on nutritional value and health benefits
- Return ONLY the JSON array, no other text`;

    // Use free LLM API for recommendations
    try {
      console.log('Using free LLM API for restaurant recommendations...');
      console.log('API URL:', FREE_LLM_API_URL);
      console.log('Model:', FREE_LLM_MODEL);
      
      const requestBody = {
        model: FREE_LLM_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.8,
          top_k: 40
        }
      };
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(FREE_LLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Full API response:', JSON.stringify(data, null, 2));
      
      if (!data.response) {
        console.error('No response field in API response:', data);
        throw new Error('No response from free LLM API');
      }

      console.log('Free LLM API response received, parsing...');
      console.log('Response text:', data.response);
      
      const suggestions: RestaurantSuggestion[] = JSON.parse(data.response);
      return suggestions;
      
    } catch (aiError: any) {
      console.error('Free LLM API error details:');
      console.error('- Error message:', aiError.message);
      console.error('- Error stack:', aiError.stack);
      console.error('- Error name:', aiError.name);
      console.error('- Error cause:', aiError.cause);
      
      console.log('Falling back to rule-based recommendations');
      return generateRuleBasedRecommendations(restaurants, healthData);
    }

  } catch (error) {
    console.error('Error in createRestaurantSuggestion:', error);
    throw new Error('Failed to generate restaurant suggestions');
  }
};

// Rule-based recommendation system (no AI API needed)
function generateRuleBasedRecommendations(
  restaurants: FoursquareVenue[], 
  healthData: HealthAssessment
): RestaurantSuggestion[] {
  const recommendations: RestaurantSuggestion[] = [];
  
  // Get user preferences
  const goal = healthData.lifestyle.primaryGoal?.toLowerCase() || '';
  const restrictions = healthData.nutrition?.restrictions || [];
  const allergies = healthData.nutrition?.allergies || [];
  const preferredCuisines = healthData.nutrition?.cuisines || [];

  // Score and filter restaurants
  const scoredRestaurants = restaurants.map(restaurant => {
    let score = restaurant.rating || 3; // Base score from rating
    let justification = `${restaurant.rating ? `Highly rated (${restaurant.rating}/5)` : 'Popular'} restaurant`;
    let suggestedDish = 'Ask for healthy options';

    const categories = restaurant.categories.map(c => c.name.toLowerCase());
    const restaurantName = restaurant.name.toLowerCase();

    // Boost score for health-related goals
    if (goal.includes('weight loss') || goal.includes('healthy')) {
      if (categories.some(cat => cat.includes('salad') || cat.includes('health') || cat.includes('vegetarian'))) {
        score += 1;
        justification += ' with healthy options perfect for weight management';
        suggestedDish = 'Try their fresh salads or grilled proteins';
      }
    }

    if (goal.includes('muscle') || goal.includes('fitness')) {
      if (categories.some(cat => cat.includes('protein') || cat.includes('grill'))) {
        score += 1;
        justification += ' offering high-protein options for fitness goals';
        suggestedDish = 'Order grilled chicken, fish, or lean meats';
      }
    }

    // Handle dietary restrictions
    if (restrictions.includes('vegetarian') || restrictions.includes('vegan')) {
      if (categories.some(cat => cat.includes('vegetarian') || cat.includes('vegan'))) {
        score += 1.5;
        justification += ' with excellent vegetarian/vegan options';
        suggestedDish = 'Try their plant-based dishes';
      }
    }

    // Handle allergies (basic filtering)
    if (allergies.includes('nuts')) {
      if (restaurantName.includes('bakery') || restaurantName.includes('dessert')) {
        score -= 0.5;
        justification += ' (check for nut-free options)';
      }
    }

    // Boost for preferred cuisines
    if (preferredCuisines.length > 0) {
      const cuisineMatch = categories.some(cat => 
        preferredCuisines.some(pref => cat.includes(pref.toLowerCase()))
      );
      if (cuisineMatch) {
        score += 0.5;
        justification += ' matching your cuisine preferences';
      }
    }

    return {
      restaurant,
      score,
      justification,
      suggestedDish
    };
  });

  // Sort by score and take top 3-5
  const topRestaurants = scoredRestaurants
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(5, restaurants.length));

  // Convert to RestaurantSuggestion format
  topRestaurants.forEach(item => {
    recommendations.push({
      name: item.restaurant.name,
      address: item.restaurant.location.formatted_address,
      cuisine: item.restaurant.categories.map(c => c.name).join(', '),
      justification: item.justification,
      suggestedDish: item.suggestedDish
    });
  });

  return recommendations;
}
