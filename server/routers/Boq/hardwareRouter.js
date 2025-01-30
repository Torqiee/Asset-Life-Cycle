const express = require('express');
const { createHardware, getAllHardware, updateHardware, deleteHardware } = require('../../controllers/Boq/hardwareController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/hardware/:folderId', authMiddleware, createHardware);
router.get('/hardware/:folderId', authMiddleware, getAllHardware);
router.put('/hardware/:id', authMiddleware, updateHardware);
router.delete('/hardware/:id', authMiddleware, deleteHardware);

module.exports = router;
