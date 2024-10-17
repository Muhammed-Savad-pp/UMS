import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired' });
            } else {
                console.log(err);
                return res.status(403).json({ message: 'Invalid token' });
            }
        }

        req.admin = admin;  
        next();  
    });
};

export default adminAuth;
