const jwt = require('jsonwebtoken');

function userProtectedRoutes(req, res, next) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Use async callback with jwt.verify
    jwt.verify(token, process.env.JWT_SECRET_KEY_AUTH, (err, decoded) => {
      if (err) {
        // Directly return here to prevent calling next() after sending a response
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded;

      // Call next only within the callback after the token is verified
      next();
    });
  } catch (err) {
    // Use next(err) to pass the error to Express error handling middleware
    next(err);
  }
}

module.exports = userProtectedRoutes;
