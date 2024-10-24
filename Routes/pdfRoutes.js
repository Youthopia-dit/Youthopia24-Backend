const express = require('express');
const router = express.Router();
const Controller = require('../controllers/pdfEditorController');
router.post('/',  Controller.getData);
module.exports = router;