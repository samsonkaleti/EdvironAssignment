const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log(`AuthMiddleware invoked for route: ${req.originalUrl}`); // Log route

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            console.log('Token Missing');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token Verification Error:', error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
