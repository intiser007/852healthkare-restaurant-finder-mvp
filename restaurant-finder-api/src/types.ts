export interface HealthAssessment {
  lifestyle: {
    primaryGoal?: "weight_loss" | "muscle_gain" | "general_health";
  };
  nutrition?: {
    restrictions: Array<"vegetarian" | "vegan" | "gluten_free" | "dairy_free">;
    allergies: Array<"nuts" | "dairy" | "eggs" | "soy" | "fish">;
    cuisines: Array<"italian" | "mexican" | "chinese" | "indian">;
  };
}

export interface RestaurantSuggestion {
  name: string;
  address: string;
  cuisine: string;
  justification: string;
  suggestedDish: string;
}

// Foursquare API response interfaces
export interface FoursquareVenue {
  fsq_id: string;
  name: string;
  categories: Array<{
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }>;
  location: {
    address?: string;
    locality?: string;
    region?: string;
    postcode?: string;
    country: string;
    formatted_address: string;
  };
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  distance?: number;
  rating?: number;
  price?: number;
  hours?: {
    open_now?: boolean;
    display?: string;
  };
  website?: string;
  tel?: string;
  closed_bucket?: string;
  photos?: Array<{
    id: string;
    prefix: string;
    suffix: string;
    width: number;
    height: number;
  }>;
  tips?: Array<{
    id: string;
    text: string;
    created_at: string;
    user: {
      first_name: string;
      last_name: string;
    };
  }>;
}

export interface FoursquareSearchResponse {
  results: FoursquareVenue[];
  context: {
    geo_bounds: {
      circle: {
        center: {
          latitude: number;
          longitude: number;
        };
        radius: number;
      };
    };
  };
}
