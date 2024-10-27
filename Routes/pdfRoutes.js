const express = require('express');
const router = express.Router();
const Controller = require('../controllers/pdfEditorController');
router.post('/',  Controller.getData);
// router.post('/',  Controller.getticket);
module.exports = router;