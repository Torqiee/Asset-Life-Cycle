const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
require('dotenv').config('./.env');

module.exports = async (request, response, next) => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return response.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return response.status(401).json({ success: false, message: 'User not found' });
    }

    request.userId = user._id;
    request.username = user.username; // Attach the username to the request object
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    response.status(401).json({ success: false, message: 'Invalid token' });
  }
};
