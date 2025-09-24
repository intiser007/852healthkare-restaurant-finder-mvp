"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockAuth = void 0;
const mockAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    // In a real app, you'd verify the token. Here, we'll just use it as the patientId.
    req.user = { patientId: token };
    next();
};
exports.mockAuth = mockAuth;
