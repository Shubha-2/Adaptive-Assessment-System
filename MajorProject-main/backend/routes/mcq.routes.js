const express = require('express');
const router = express.Router();
const mcqController = require('../controllers/mcq.controller');
const auth = require('../middleware/auth.middleware');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', auth, upload.single('pdfFile'), mcqController.generateAndSaveMCQs);
router.get('/', auth, mcqController.getMCQs);

module.exports = router;
