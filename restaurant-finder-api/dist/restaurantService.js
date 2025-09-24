"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
class RestaurantService {
    constructor(apiKey) {
        this.baseUrl = 'https://places-api.foursquare.com';
        this.apiKey = apiKey;
    }
    searchRestaurants(latitude_1, longitude_1, query_1, categories_1) {
        return __awaiter(this, arguments, void 0, function* (latitude, longitude, query, categories, // comma-separated category IDs
        radius = 3000, // 3 km default
        limit = 20) {
            var _a;
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
                console.log('Using API Key:', ((_a = process.env.FOURSQUARE_API_KEY) === null || _a === void 0 ? void 0 : _a.substring(0, 10)) + '...');
                // Use correct Foursquare API format with required headers
                const response = yield fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${process.env.FOURSQUARE_API_KEY}`,
                        'Accept': 'application/json',
                        'X-Places-Api-Version': '2025-06-17'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = yield response.json();
                const restaurants = data.results || [];
                // Filter out obviously closed restaurants
                return restaurants.filter((venue) => venue.closed_bucket !== 'VeryLikelyClosedPermanently' &&
                    venue.closed_bucket !== 'LikelyClosedPermanently');
            }
            catch (error) {
                console.error('Foursquare API error:', error.message);
                throw new Error(`Failed to fetch restaurant data from Foursquare API: ${error.message}`);
            }
        });
    }
    getRestaurantsByCategory(latitude, longitude, categories) {
        return __awaiter(this, void 0, void 0, function* () {
            // category IDs — adjust as needed
            const categoryMap = {
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
        });
    }
    getVenueDetails(fsqId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${this.baseUrl}/places/${fsqId}?fields=fsq_id,name,categories,location,geocodes,rating,price,hours,website,tel,photos,tips,closed_bucket`;
                const response = yield fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${process.env.FOURSQUARE_API_KEY}`,
                        'Accept': 'application/json',
                        'X-Places-Api-Version': '2025-06-17'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Foursquare venue details error:', error.message);
                throw new Error('Failed to fetch venue details');
            }
        });
    }
    /**
     * Search restaurants by location name (e.g., "Hong Kong", "New York")
     */
    searchRestaurantsByLocation(locationName_1, query_1, categories_1) {
        return __awaiter(this, arguments, void 0, function* (locationName, query, categories, radius = 3000, limit = 20) {
            var _a;
            try {
                // Build URL with location name instead of coordinates
                let url = `${this.baseUrl}/places/search?near=${encodeURIComponent(locationName)}&limit=${limit}`;
                if (categories) {
                    url += `&categories=${categories}`;
                }
                if (query) {
                    url += `&query=${encodeURIComponent(query)}`;
                }
                console.log('Foursquare API URL (location search):', url);
                console.log('Using API Key:', ((_a = process.env.FOURSQUARE_API_KEY) === null || _a === void 0 ? void 0 : _a.substring(0, 10)) + '...');
                const response = yield fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${process.env.FOURSQUARE_API_KEY}`,
                        'Accept': 'application/json',
                        'X-Places-Api-Version': '2025-06-17'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = yield response.json();
                const restaurants = data.results || [];
                // Filter out obviously closed restaurants
                return restaurants.filter((venue) => venue.closed_bucket !== 'VeryLikelyClosedPermanently' &&
                    venue.closed_bucket !== 'LikelyClosedPermanently');
            }
            catch (error) {
                console.error('Foursquare location search error:', error.message);
                throw new Error(`Failed to fetch restaurants for location: ${error.message}`);
            }
        });
    }
}
exports.RestaurantService = RestaurantService;
