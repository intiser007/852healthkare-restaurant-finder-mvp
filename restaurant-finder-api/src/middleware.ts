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
