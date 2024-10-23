const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

function userProtectedRoutes(req, res, next) {
  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify token using jwt.verify
  jwt.verify(token, process.env.JWT_SECRET_KEY_AUTH, (err, decoded) => {
    if (err) {
      // Return early if token is invalid or expired
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Fetch user details from the database using .then()
    console.log(decoded)
    User.findById(decoded.id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Store the user information in req.user
        req.user = user;

        // Call the next middleware or route handler
        next();
      })
      .catch(error => {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      });
  });
}

module.exports = userProtectedRoutes;
