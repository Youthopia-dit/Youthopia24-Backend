const jwt = require('jsonwebtoken');

function userProtectedRoutes(req, res, next) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY_AUTH, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded;
    });

    next();
  } catch (err) {
    res.send(err);
  }
}

module.exports = userProtectedRoutes;
