// This file can be shared between frontend and backend
export interface RestaurantSuggestion {
  name: string;
  address: string;
  cuisine: string;
  justification: string;
  suggestedDish: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
