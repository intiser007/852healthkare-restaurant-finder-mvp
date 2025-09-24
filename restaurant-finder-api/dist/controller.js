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
exports.getRestaurantSuggestionsForLocation = exports.getRestaurantSuggestions = void 0;
const service_1 = require("./service");
const getRestaurantSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { latitude, longitude } = req.body;
        const patientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.patientId;
        if (!latitude || !longitude || !patientId) {
            return res.status(400).json({
                message: 'Missing required fields: latitude, longitude, and patientId'
            });
        }
        // Validate coordinates
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({
                message: 'Latitude and longitude must be numbers'
            });
        }
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                message: 'Invalid coordinates provided'
            });
        }
        console.log(`Getting restaurant suggestions for patient ${patientId} at ${latitude}, ${longitude}`);
        const suggestions = yield (0, service_1.createRestaurantSuggestion)(patientId, latitude, longitude);
        res.status(200).json(suggestions);
    }
    catch (error) {
        console.error('Error in getRestaurantSuggestions:', error);
        if (error instanceof Error) {
            if (error.message.includes('API key') || error.message.includes('authentication')) {
                return res.status(401).json({
                    message: 'API authentication failed. Please check your API keys.'
                });
            }
            if (error.message.includes('Failed to fetch restaurant data')) {
                return res.status(503).json({
                    message: 'Restaurant data service is currently unavailable.'
                });
            }
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getRestaurantSuggestions = getRestaurantSuggestions;
const getRestaurantSuggestionsForLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { locationName } = req.body;
        const patientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.patientId;
        if (!locationName || !patientId) {
            return res.status(400).json({
                message: 'Missing required fields: locationName and patientId'
            });
        }
        // Validate location name
        if (typeof locationName !== 'string' || locationName.trim().length === 0) {
            return res.status(400).json({
                message: 'Location name must be a non-empty string'
            });
        }
        console.log(`Getting restaurant suggestions for patient ${patientId} in location: ${locationName}`);
        const suggestions = yield (0, service_1.createRestaurantSuggestionForLocation)(patientId, locationName.trim());
        res.status(200).json(suggestions);
    }
    catch (error) {
        console.error('Error in getRestaurantSuggestionsForLocation:', error);
        if (error instanceof Error) {
            if (error.message.includes('API key') || error.message.includes('authentication')) {
                return res.status(401).json({
                    message: 'API authentication failed. Please check your API keys.'
                });
            }
            if (error.message.includes('Failed to fetch restaurants for location')) {
                return res.status(503).json({
                    message: 'Restaurant data service is currently unavailable for this location.'
                });
            }
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getRestaurantSuggestionsForLocation = getRestaurantSuggestionsForLocation;
