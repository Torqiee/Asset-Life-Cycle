const express = require('express');
const multer = require('multer');
const { uploadExcel } = require('../controllers/excelController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('file'), uploadExcel);

module.exports = router;
