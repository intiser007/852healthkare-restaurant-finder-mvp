# Restaurant Finder UI

A Vue 3 + Quasar frontend application that provides an intuitive interface for finding personalized restaurant recommendations based on user location and health preferences.

## Features

- **Location-Based Search**: Automatic location detection using browser geolocation
- **Beautiful UI**: Modern, responsive design using Quasar Framework
- **Real-Time Recommendations**: Displays personalized restaurant suggestions
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Smooth loading animations and feedback
- **Restaurant Cards**: Rich display of restaurant information and recommendations

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser with geolocation support

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.development` file in the project root:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:8080` with hot reload.

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── App.vue                    # Root component
├── types.ts                   # TypeScript interfaces
├── components/
│   ├── RestaurantFinderPage.vue  # Main page component
│   └── RestaurantCard.vue        # Restaurant display component
└── services/
    ├── api.ts                 # API communication service
    └── location.ts            # Geolocation service
```

## Key Components

### RestaurantFinderPage.vue
The main page component that:
- Handles the "Find Restaurants" button click
- Manages loading states and error handling
- Displays restaurant recommendations
- Integrates with location and API services

### RestaurantCard.vue
Displays individual restaurant recommendations with:
- Restaurant name and cuisine type
- Address and location information
- AI-generated justification for the recommendation
- Suggested dish based on health profile
- Action buttons for directions and calling

## Services

### API Service (`services/api.ts`)
- Communicates with the backend API
- Handles authentication headers
- Provides comprehensive error handling
- Returns typed restaurant suggestion data

### Location Service (`services/location.ts`)
- Uses browser geolocation API
- Handles location permission requests
- Provides user-friendly error messages
- Includes timeout and accuracy settings

## User Experience Features

### Loading States
- Animated spinner during API calls
- Progress messages to keep users informed
- Disabled buttons to prevent multiple requests

### Error Handling
- Location permission denied
- Network connectivity issues
- API service unavailable
- Invalid location data

### Responsive Design
- Mobile-first approach
- Adapts to different screen sizes
- Touch-friendly interface
- Modern gradient backgrounds

## Integration with Backend

The frontend communicates with the backend API using:
- **Endpoint**: `POST /api/suggestions`
- **Authentication**: Bearer token (`test-patient-123`)
- **Payload**: User's latitude and longitude
- **Response**: Array of restaurant recommendations

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Requires geolocation API support for location detection.

## Customization

### Styling
- Uses Quasar's theming system
- Custom CSS variables in `src/quasar-variables.sass`
- Scoped component styles for isolation

### API Configuration
- Environment-based API URL configuration
- Easy to switch between development and production endpoints

## Future Enhancements

- User preference settings
- Restaurant favorites
- Search filters and sorting
- Map integration
- Social sharing features
