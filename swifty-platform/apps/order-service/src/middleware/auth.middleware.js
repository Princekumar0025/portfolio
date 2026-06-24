const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        // Mock payload for ease of testing during development phase
        if (process.env.NODE_ENV !== 'production') {
            req.user = { id: "dev-user-uuid" };
            return next();
        }
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
        }
        req.user = decoded;
        next();
    });
};
