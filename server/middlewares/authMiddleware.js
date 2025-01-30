const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
require('dotenv').config('./.env');

module.exports = async (request, response, next) => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return response.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    // Verify token and extract payload
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Check if userId is part of the decoded token
    if (!decoded.userId) {
      return response.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    // Fetch user from the database using userId
    const user = await User.findById(decoded.userId);

    // Check if user exists
    if (!user) {
      return response.status(401).json({ success: false, message: 'User not found' });
    }

    // Attach user data to the request object
    request.user = user;
    request.userId = user._id.toString(); // Ensure it's a string for consistency
    request.username = user.username;
    request.role = user.role;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    response.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
