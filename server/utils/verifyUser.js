import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'You are not authenticated'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(errorHandler(401, 'Token has expired'));
            }
            return next(errorHandler(401, 'Token is not valid'));
        }
        
        req.user = user;  
        next(); 
    });
};
