const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyAuthToken } = require('../middleware/eventMiddleware');

router.get('/', eventController.getAllEvents);

router.get('/:id', eventController.getEventById);

router.post('/', verifyAuthToken, eventController.createEvent);

module.exports = router;