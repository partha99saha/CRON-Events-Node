const User = require('../models').User;
const jwt = require('jsonwebtoken');
const config = require('../config/config')
const JWT_SECRET = config.jwtSecret;

/**
 * Method to create a JWT token
 * @param {*} user 
 * @returns 
 */
exports.createToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin || false,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token valid for 1 hour
};

/**
 * Middleware to verify a token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Attach the decoded user info to the request object
        req.user = decoded;
        // Optionally: You could check if the user still exists in the database
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

/**
 * check user is ADMIN 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user && user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (error) {
        console.error('Error checking admin role:', error);
        res.status(500).send('Server error');
    }
};
