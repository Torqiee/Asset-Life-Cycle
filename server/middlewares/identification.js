const User = require('../models/usersModel');  // Import the User model
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' }); // Specify path to your .env file

// exports.identifier = (request, response, next) => {
//     let token;

//     if (request.headers.client === 'not-browser') {
//         token = request.headers.authorization;
//         console.log('Authorization Header:', token);
//     } else {
//         token = request.cookies['Authorization'];
//         console.log('Authorization Cookie:', token);
//     }

//     if (!token) {
//         console.log('Token missing.');
//         return response.status(403).json({ success: false, message: 'Unauthorized: Token missing' });
//     }

//     try {
//         const userToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
//         console.log('Extracted Token:', userToken);

//         const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
//         console.log('Verified JWT Payload:', jwtVerified);

//         request.user = jwtVerified; // Attach verified payload to the request
//         next();
//     } catch (error) {
//         console.error('JWT verification failed:', error.message);
//         return response.status(403).json({ success: false, message: 'Invalid token' });
//     }
// };

// Development 
exports.authenticate = async (request, response, next) => {
    const token = request.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return response.status(401).json({ message: 'Authentication requestuired' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.user = await User.findById(decoded._id);
      
      if (!request.user) {
        return response.status(401).json({ message: 'User not found' });
      }
      
      next();  // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      response.status(401).json({ message: 'Invalid or expired token' });
    }
  };