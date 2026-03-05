const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey123');
        req.worker = decoded; // Attach the worker payload (id, employeeId, mobileNumber) to the request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Token is invalid or expired' });
    }
};

module.exports = { requireAuth };
