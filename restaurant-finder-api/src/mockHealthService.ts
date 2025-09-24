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
