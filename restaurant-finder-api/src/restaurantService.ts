import axios from 'axios';
import { FoursquareSearchResponse, FoursquareVenue } from './types';

export class RestaurantService {
  private apiKey: string;
  private baseUrl = 'https://places-api.foursquare.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchRestaurants(
    latitude: number,
    longitude: number,
    query?: string,
    categories?: string,  // comma-separated category IDs
    radius = 3000,        // 3 km default
    limit = 20
  ): Promise<FoursquareVenue[]> {
    try {
      // Fetch more results to have better filtering options
      const fetchLimit = Math.max(limit * 3, 50); // Fetch 3x more than needed
      let url = `${this.baseUrl}/places/search?ll=${latitude},${longitude}&limit=${fetchLimit}`;
      
      if (query) {
        url += `&query=${encodeURIComponent(query)}`;
      }

      console.log('Foursquare API URL:', url);
      console.log('Using API Key:', process.env.FOURSQUARE_API_KEY?.substring(0, 10) + '...');

      // Use correct Foursquare API format with required headers
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.FOURSQUARE_API_KEY!}`,
          'Accept': 'application/json',
          'X-Places-Api-Version': '2025-06-17'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const allResults = data.results || [];

      // Filter results client-side to only include restaurants and cafes
      const filteredResults = allResults.filter((venue: FoursquareVenue) => {
        // First, filter out closed restaurants
        if (venue.closed_bucket === 'VeryLikelyClosedPermanently' || 
            venue.closed_bucket === 'LikelyClosedPermanently') {
          return false;
        }

        // Then filter by categories to only include food-related places
        const categories = venue.categories || [];
        const isFoodRelated = categories.some(cat => {
          const categoryName = cat.name.toLowerCase();
          return categoryName.includes('restaurant') ||
                 categoryName.includes('cafe') ||
                 categoryName.includes('coffee') ||
                 categoryName.includes('food') ||
                 categoryName.includes('dining') ||
                 categoryName.includes('bar') ||
                 categoryName.includes('bistro') ||
                 categoryName.includes('eatery') ||
                 categoryName.includes('kitchen') ||
                 categoryName.includes('grill') ||
                 categoryName.includes('pizza') ||
                 categoryName.includes('sushi') ||
                 categoryName.includes('bakery') ||
                 categoryName.includes('deli') ||
                 categoryName.includes('fast food') ||
                 categoryName.includes('buffet');
        });

        return isFoodRelated;
      });

      // Return only the requested number of results
      return filteredResults.slice(0, limit);
    } catch (error: any) {
      console.error('Foursquare API error:', error.message);
      throw new Error(`Failed to fetch restaurant data from Foursquare API: ${error.message}`);
    }
  }

  async getRestaurantsByCategory(
    latitude: number,
    longitude: number,
    categories: string[]
  ): Promise<FoursquareVenue[]> {
    // Use the new filtering approach instead of category IDs
    // This will fetch all food-related places and filter them
    return this.searchRestaurants(latitude, longitude);
  }

  async getVenueDetails(fsqId: string): Promise<FoursquareVenue> {
    try {
      const url = `${this.baseUrl}/places/${fsqId}?fields=fsq_id,name,categories,location,geocodes,rating,price,hours,website,tel,photos,tips,closed_bucket`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.FOURSQUARE_API_KEY!}`,
          'Accept': 'application/json',
          'X-Places-Api-Version': '2025-06-17'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Foursquare venue details error:', error.message);
      throw new Error('Failed to fetch venue details');
    }
  }

}
