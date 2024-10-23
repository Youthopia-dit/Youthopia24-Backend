const jwt = require('jsonwebtoken');

function userProtectedRoutes(req, res, next) {
  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify token using jwt.verify
  jwt.verify(token, process.env.JWT_SECRET_KEY_AUTH, (err, decoded) => {
    if (err) {
      // Return early if token is invalid or expired
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Store decoded user information in req.user
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  });
}

module.exports = userProtectedRoutes;
