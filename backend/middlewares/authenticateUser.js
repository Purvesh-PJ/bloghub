const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
    // console.log(req);

    const authorizationHeader = req.header('authorization') || req.header('Authorization');
    // console.log(authorizationHeader);
    if(!authorizationHeader){
        req.user = null;
        return next();
    }

    const token = req.header('authorization').split(' ')[1];
    // console.log(token);

    if(!token){
        return res.status(401).json({ message : 'Authorization token is missing' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken.user;
        next();
    } 
    catch(error){
        return res.status(401).json({ message: 'Invalid token' });
    }
}; 

// Middleware to check if user is an admin
exports.authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    next();
};