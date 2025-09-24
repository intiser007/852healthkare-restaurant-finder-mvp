## Summer Internship Task: Build a Smart Restaurant Finder MVP (Standalone)

### 1. Introduction

Welcome, candidate! This task is designed to assess your practical coding skills and problem-solving capabilities. Your mission is to build a **standalone minimum viable prototype (MVP)** of a "Smart Restaurant Finder" feature.

The goal is to provide users with personalized restaurant recommendations based on their health profile and current location. Although you will build this as a standalone project, it must be **designed for seamless integration** into our existing application ecosystem. This means you must follow the specified architecture, API contracts, and data structures precisely.

You will create two separate projects:
- A **backend server** using Node.js, Express, and TypeScript.
- A **frontend web app** using Vue 3, Quasar, and TypeScript.

### 2. Project Context & Technical Requirements

Our application ecosystem revolves around a "Smart Health Assessment" that captures user goals and preferences. For this task, you will use a mock version of this data to power your feature.

#### Proposed Tech Stack:
- **Frontend**: Vue 3, Quasar Framework, TypeScript. (`quasar create my-app -b dev`)
- **Backend**: Node.js, Express, TypeScript. (`npm init`, `npm i express typescript @types/express @types/node ts-node-dev cors dotenv`)
- **AI Service**: OpenAI's GPT-4o API (or another powerful LLM with web search capabilities). (`npm i openai`)

Your implementation will leverage an LLM's ability to perform web searches for local restaurants and their menus, then use the provided user health data to generate tailored recommendations.

### 3. Task Breakdown: Standalone Backend Server

Your goal is to create a standalone Express server with a single API endpoint that returns personalized restaurant suggestions.

#### 3.1. Project Setup
1.  Initialize a new Node.js project.
2.  Install the necessary dependencies: `express`, `typescript`, `cors`, `dotenv`, `openai`, and development dependencies like `@types/node`, `@types/express`, `ts-node-dev`.
3.  Set up a basic `tsconfig.json` and a `src` directory with an `index.ts` file.
4.  Create a `.env` file for your `OPENAI_API_KEY`.
**Note:** Please **do not submit your OpenAI API key** or any other sensitive credentials with your assignment.

#### 3.2. Data Models & Mocks
To simulate our environment, you must use the following data structures. Create a `src/types.ts` file for them.

**Health Assessment Data Structure (subset):**
```typescript
// src/types.ts
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
```

**Mock Data Service:**
Create a mock service to provide sample health data, as you won't have access to our database.

```typescript
// src/mockHealthService.ts
import { HealthAssessment } from './types';

export function getMockHealthAssessment(patientId: string): HealthAssessment {
  // In a real app, this would be a database call.
  // For this task, return a static mock object.
  console.log(`Fetching mock data for patientId: ${patientId}`);
  return {
    lifestyle: {
      primaryGoal: "weight_loss",
    },
    nutrition: {
      restrictions: ["vegetarian"],
      allergies: ["nuts"],
      cuisines: ["italian", "indian"],
    },
  };
}
```

#### 3.3. API Endpoint
1.  **Create the Endpoint**: Define a `POST /suggestions` endpoint.
2.  **Authentication Middleware**: Create a mock authentication middleware. It should simply extract a `patientId` from an `Authorization` header (e.g., `Bearer test-patient-123`) and attach it to the `Request` object. This simulates a jwt.
3.  **Request Body**: The endpoint must accept a JSON body with the user's location:
    `{ "latitude": 40.7128, "longitude": -74.0060 }`
4.  **Core Logic**:
    -   The endpoint handler will use the mock middleware to get a `patientId`.
    -   It will call your `getMockHealthAssessment` function to get the user's health data.
    -   It will then call your AI service.
5.  **AI Service (`aiService.ts`):**
    -   This service will contain the logic for interacting with the OpenAI API.
    -   **Construct a Detailed Prompt**: This is the most critical part. Your prompt must instruct the LLM to act as a nutrition-savvy assistant and include:
        -   The user's fitness goal, dietary restrictions, allergies, and cuisine preferences from the mock data.
        -   The user's current latitude and longitude.
        -   A clear instruction to **search the web** for nearby restaurants.
        -   An instruction to find menu highlights for the most promising restaurants.
        -   An instruction to return a list of 3-5 restaurants.
    -   **Define a Structured Output**: Ask the LLM to return a valid JSON object matching this interface:
        ```typescript
        // src/types.ts
        export interface RestaurantSuggestion {
          name: string;
          address: string;
          cuisine: string;
          justification: string;
          suggestedDish: string;
        }
        ```
6.  **Response**: Send the JSON array of `RestaurantSuggestion` objects back to the client.

---

### 4. Task Breakdown: Standalone Frontend App

Your goal is to create a single-page Vue application using the Quasar framework to interact with your backend.

#### 4.1. Project Setup
1.  Use the Quasar CLI to create a new Vue 3 + TypeScript project.
2.  Choose `axios` for API requests during setup or install it later.
3.  The project should have a main page (`src/pages/IndexPage.vue` or a new page like `RestaurantFinderPage.vue`).

#### 4.2. UI/UX Design
The UI should be clean, simple, and match the Quasar design language.
-   A button to "Find Restaurants Near Me".
-   A loading indicator (`q-spinner`) to show while the API call is in progress.
-   A section to display the restaurant suggestions, perhaps using `q-card` for each. Each card should display the restaurant's name, address, cuisine, the justification, and the suggested dish.
-   A user-friendly message (`q-banner` or `q-notify`) if no suggestions are found or if an error occurs.

#### 4.3. Frontend Logic
1.  **API Service**: Create a service file (e.g., `src/services/api.ts`) that uses `axios` to communicate with your backend. It should have a function like `getRestaurantSuggestions(lat, lon)`. Configure the base URL using an environment variable (`.env.development`).
2.  **Get User Location**: Use the browser's `navigator.geolocation.getCurrentPosition` API to get the user's location when they click the search button.
4.  **API Call**: On button click, get the location, and then call your API service. Pass a static mock token in the `Authorization` header (e.g., `Bearer test-patient-123`).
5.  **Error Handling**: Show user-friendly error messages if the API call fails or the location cannot be retrieved.

### 5. Evaluation Criteria

-   **Functionality**: Does the prototype work end-to-end?
-   **Code Quality**: Is your code clean, well-structured, readable, and maintainable?
-   **Adherence to Requirements**: How closely did you follow the specified architecture, data models, and API contracts? This is key for integration.
-   **Problem Solving**: How effectively did you use prompt engineering to get reliable, structured JSON from the LLM?
-   **User Experience**: Is the UI simple, intuitive, and does it provide clear feedback?

---

### 6. Project Skeletons

To help you get started, here is a complete skeleton for both the backend and frontend projects. You can create these files and then fill in the missing logic.

#### 6.1. Backend Skeleton (`restaurant-finder-api`)

**File: `package.json`**
```json
{
  "name": "restaurant-finder-api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "openai": "^4.0.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.4"
  }
}
```

**File: `tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**File: `.env.example`**
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```
*(Remember to create a `.env` file from this example)*

**File: `src/index.ts`**
```typescript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { suggestionRouter } from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', suggestionRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

**File: `src/routes.ts`**
```typescript
import { Router } from 'express';
import { getRestaurantSuggestions } from './controller';
import { mockAuth } from './middleware';

const router = Router();

router.post('/suggestions', mockAuth, getRestaurantSuggestions);

export { router as suggestionRouter };
```

**File: `src/middleware.ts`**
```typescript
import { Request, Response, NextFunction } from 'express';

// Extend the Request type to include your custom property
declare global {
  namespace Express {
    interface Request {
      user?: { patientId: string };
    }
  }
}

export const mockAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  // In a real app, you'd verify the token. Here, we'll just use it as the patientId.
  req.user = { patientId: token };
  
  next();
};
```

**File: `src/types.ts`**
```typescript
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
```

**File: `src/controller.ts`**
```typescript
import { Request, Response } from 'express';
import { createRestaurantSuggestion } from './service';

export const getRestaurantSuggestions = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.body;
    const patientId = req.user?.patientId;

    if (!latitude || !longitude || !patientId) {
      return res.status(400).json({ message: 'Missing required fields: latitude, longitude, and patientId' });
    }

    //
    // <<< YOUR LOGIC HERE >>>
    // 1. Call the service function `createRestaurantSuggestion`
    // 2. Pass the necessary arguments.
    // 3. Return a 200 response with the suggestions.
    //
    
    // Placeholder response:
    res.status(501).json({ message: 'Not implemented' });

  } catch (error) {
    console.error('Error in getRestaurantSuggestions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
```

**File: `src/service.ts`**
```typescript
import OpenAI from 'openai';
import { getMockHealthAssessment } from './mockHealthService';
import { RestaurantSuggestion } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createRestaurantSuggestion = async () => {
  // <<< YOUR LOGIC HERE >>>
};
```

**File: `src/mockHealthService.ts`**
```typescript
import { HealthAssessment } from './types';

export function getMockHealthAssessment(patientId: string): HealthAssessment {
  // In a real app, this would be a database call.
  // For this task, return a static mock object.
  console.log(`Fetching mock data for patientId: ${patientId}`);
  return {
    lifestyle: {
      primaryGoal: "weight_loss",
    },
    nutrition: {
      restrictions: ["vegetarian"],
      allergies: ["nuts"],
      cuisines: ["italian", "indian"],
    },
  };
}
```

#### 6.2. Frontend Skeleton (`restaurant-finder-ui`)

After creating a new Quasar project (`quasar create restaurant-finder-ui`), you can use these files.

**File: `src/pages/RestaurantFinderPage.vue`**
```vue
<template>
  <q-page class="q-pa-md">
    <div class="column items-center q-gutter-md">
      <div class="text-h4">Smart Restaurant Finder</div>
      <q-btn
        label="Find Restaurants Near Me"
        color="primary"
        @click="handleFindRestaurants"
        :loading="isLoading"
        :disable="isLoading"
      />
      <!-- Build your own UI here -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { getSuggestions } from 'src/services/api';
import { RestaurantSuggestion } from 'src/types';

const $q = useQuasar();

const isLoading = ref(false);
const error = ref<string | null>(null);
const suggestions = ref<RestaurantSuggestion[]>([]);

const handleFindRestaurants = async () => {
    // <<< YOUR LOGIC HERE >>>
};
</script>
```

**File: `src/services/api.ts`**
```typescript
import axios from 'axios';
import { RestaurantSuggestion } from 'src/types';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSuggestions = async (
  location: { latitude: number; longitude: number }
) => {
  
  // <<< YOUR LOGIC HERE >>>
  // 1. Make a POST request to the `/suggestions` endpoint using `apiClient`.
  // 2. Pass the location in the request body.
  // 3. Include a mock 'Authorization' header, e.g., 'Bearer test-patient-123'.
  // 4. Return the data from the response.
  
  // Placeholder implementation:
  console.log('Making API call for location:', location);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  
};
```

**File: `src/types.ts`**
```typescript
// This file can be shared between frontend and backend
export interface RestaurantSuggestion {
  name: string;
  address: string;
  cuisine: string;
  justification: string;
  suggestedDish: string;
}
```

**File: `.env.development.example`**
```
# This is the base URL for your backend API
API_BASE_URL=http://localhost:3000/api
```
*(Remember to create a `.env.development` file in your Quasar project root)* 

Good luck! We are excited to see what you build.