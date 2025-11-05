// auth.middleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "1234";

function authenticate(req, res, next) {
    const auth = req.headers.authorization;

    if(!auth || !auth.startsWith('Bearer')) 
        return res.status(401).json({message: "No autorizado."});

    const token = auth.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        req.user = {
            id: payload.id,
            username: payload.username,
            role: payload.role
        };

        next();
    } catch(err) {
        return res.status(401).json({message: "No autorizado"});
    }
}

module.exports = { authenticate };