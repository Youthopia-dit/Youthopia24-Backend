// middleware/authMiddleware.js
exports.verifyAuthToken = (req, res, next) => {
    // Dummy authentication, just pass the request forward for testing
    next();
  };
  