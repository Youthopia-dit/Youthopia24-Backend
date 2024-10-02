const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.post('/eventRegister', registrationController.registerEvent);

module.exports = router;