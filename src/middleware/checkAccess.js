//checking if user is admin or not

const checkAccess = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role === 'admin' || req.user.role === requiredRole) {
            next();
        } else {
            res.status(403).json({
                error: 'Access denied.',
            });
        }
    };
};

module.exports = checkAccess;