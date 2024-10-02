function userProtectedRoutes(req, res, next) {
  console.log('Helllo');

  next();
}

module.exports = userProtectedRoutes;
