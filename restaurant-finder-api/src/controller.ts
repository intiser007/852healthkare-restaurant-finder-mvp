import { Request, Response } from 'express';
import { createRestaurantSuggestion } from './service';

export const getRestaurantSuggestions = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.body;
    const patientId = req.user?.patientId;

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

    const suggestions = await createRestaurantSuggestion(patientId, latitude, longitude);

    res.status(200).json(suggestions);

  } catch (error) {
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
};
