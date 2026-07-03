const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];
    return [
        authenticate,
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
            }
            next();
        }
    ];
};

module.exports = { authenticate, authorize };
