const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.post('/eventRegister', registrationController.registerEvent);
router.post('/getRegistrations',registrationController.getRegistrationsByIds);

module.exports = router;