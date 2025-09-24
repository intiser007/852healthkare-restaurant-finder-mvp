import axios from 'axios';
import { RestaurantSuggestion, LocationData } from '@/types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSuggestions = async (
  location: LocationData
): Promise<RestaurantSuggestion[]> => {
  try {
    console.log('Making API call for location:', location);
    
    const response = await apiClient.post('/suggestions', {
      latitude: location.latitude,
      longitude: location.longitude
    }, {
      headers: {
        'Authorization': 'Bearer test-patient-123'
      }
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please try again.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid location data provided.');
      } else if (error.response?.status === 503) {
        throw new Error('Restaurant data service is currently unavailable.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
    }
    
    throw new Error('An unexpected error occurred. Please try again.');
  }
};
