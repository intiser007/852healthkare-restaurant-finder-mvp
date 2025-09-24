import { Router } from 'express';
import { getRestaurantSuggestions } from './controller';
import { mockAuth } from './middleware';

const router = Router();

router.post('/suggestions', mockAuth, getRestaurantSuggestions);

export { router as suggestionRouter };
