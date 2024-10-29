const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const userProtectedRoutes = require("../middleware/userProtectedRoutes");

router.post('/eventRegister',userProtectedRoutes, registrationController.registerEvent);
router.post('/getRegistrations',registrationController.getRegistrationsByIds);
router.get('/getRegistrations/:id',registrationController.getRegistrationByEventIDs)

module.exports = router;