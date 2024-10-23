const express = require('express');
const router = express.Router();
const highlightController = require('../controllers/highlightController');

router.get('/', highlightController);

module.exports = router;
