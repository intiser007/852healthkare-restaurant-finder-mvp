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
      // Build URL with query parameters directly (following the working example)
        let url = `${this.baseUrl}/places/search?ll=${latitude},${longitude}&limit=${limit}`;
      
      if (categories) {
        url += `&categories=${categories}`;
      }
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
      const restaurants = data.results || [];

      // Filter out obviously closed restaurants
      return restaurants.filter((venue: FoursquareVenue) =>
        venue.closed_bucket !== 'VeryLikelyClosedPermanently' &&
        venue.closed_bucket !== 'LikelyClosedPermanently'
      );
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
    // category IDs — adjust as needed
    const categoryMap: Record<string, string> = {
      italian: '13236',
      mexican: '13303',
      chinese: '13145',
      indian: '13199',
      vegetarian: '13377',
      vegan: '13377',
      healthy: '13065',
      general: '13065',
    };

    const ids = categories
      .map(c => categoryMap[c.toLowerCase()])
      .filter(Boolean)
      .join(',');

    const searchCategories = ids || categoryMap.general;
    return this.searchRestaurants(latitude, longitude, undefined, searchCategories);
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
