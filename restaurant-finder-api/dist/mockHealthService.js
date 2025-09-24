"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockHealthAssessment = getMockHealthAssessment;
function getMockHealthAssessment(patientId) {
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
