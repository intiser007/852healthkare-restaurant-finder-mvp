# Restaurant Finder API

A Node.js/Express backend API that provides personalized restaurant recommendations using real-time data from Foursquare Places API and AI-powered analysis from Google Gemini AI.

## Features

- **Real-time Restaurant Data**: Uses Foursquare Places API to fetch current restaurant information
- **AI-Powered Recommendations**: Google Gemini AI analyzes restaurants based on user health profiles
- **Mock Health Assessment**: Simulates user health data for personalized recommendations
- **RESTful API**: Clean `/api/suggestions` endpoint for frontend integration
- **TypeScript**: Full TypeScript support for better development experience

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key (free tier available)
- Foursquare API key (free tier available)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   FOURSQUARE_API_KEY=your_foursquare_api_key_here
   ```

3. **Get API Keys**
   
   **Google Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey) or [Google AI for Developers](https://ai.google.dev/)
   - Sign in with your Google account
   - Create a new API key
   
   **Foursquare API Key:**
   - Go to [Foursquare Developer Console](https://foursquare.com/developers/signup)
   - Create a developer account
   - Create a new app to get your API key
   - Free tier includes 10,000 API calls for testing

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start at `http://localhost:3000` with hot reload.

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### POST /api/suggestions

Returns personalized restaurant recommendations based on user location and health profile.

**Request:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Headers:**
```
Authorization: Bearer test-patient-123
Content-Type: application/json
```

**Response:**
```json
[
  {
    "name": "Green Garden Bistro",
    "address": "123 Main St, New York, NY 10001",
    "cuisine": "Vegetarian, Healthy",
    "justification": "Perfect for weight loss goals with vegetarian options and no nuts in their main dishes.",
    "suggestedDish": "Quinoa Buddha Bowl with tahini dressing"
  }
]
```

### GET /health

Health check endpoint to verify the API is running.

## Project Structure

```
src/
├── index.ts          # Main server file
├── types.ts          # TypeScript interfaces
├── routes.ts         # API routes
├── controller.ts     # Request handlers
├── service.ts        # AI service logic
├── restaurantService.ts  # Yelp API integration
├── mockHealthService.ts  # Mock health data
└── middleware.ts     # Authentication middleware
```

## Architecture

The API follows a clean architecture pattern:

1. **Routes** → Define API endpoints
2. **Controllers** → Handle HTTP requests/responses
3. **Services** → Business logic and external API calls
4. **Types** → TypeScript interfaces for type safety

## Error Handling

The API includes comprehensive error handling for:
- Invalid coordinates
- Missing API keys
- External API failures
- Authentication errors

## Mock Data

The system uses mock health assessment data for demonstration:
- Primary Goal: Weight loss
- Dietary Restrictions: Vegetarian
- Allergies: Nuts
- Preferred Cuisines: Italian, Indian

In a production environment, this would be replaced with actual user data from a database.

## Integration Notes

This API is designed to integrate seamlessly with the existing HealthKare application ecosystem. The data structures and authentication patterns follow the specified requirements for future integration.
