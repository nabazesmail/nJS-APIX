const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      role: decoded.role,
      userId: decoded.userId,
    };
    next();
  } catch (err) {
    res.status(401).json({
      error: 'Invalid token.',
    });
  }
};

const getUserInfoFromToken = (token) => {
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
          fullName: decoded.fullName,
          email: decoded.email,
          role: decoded.role,
          profileImage: decoded.profileImage
      };
  } catch (error) {
      // Handle invalid token or other errors
      throw new Error('Failed to get user information from token.');
  }
};


module.exports = {authenticate, getUserInfoFromToken};
