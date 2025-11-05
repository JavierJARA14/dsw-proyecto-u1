module.exports = function roleAuth(requiredRoles) {
    return function (req, res, next) {
        if (!req.user)
            return res.status(401).json({ message: 'No autorizado' });

        const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

        if (!roles.includes(req.user.role))
            return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });

        next();
    };
};