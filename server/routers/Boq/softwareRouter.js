const express = require('express');
const { createSoftware, getAllSoftware, updateSoftware, deleteSoftware } = require('../../controllers/Boq/softwareController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/software/:folderId', authMiddleware, createSoftware);
router.get('/software/:folderId', authMiddleware, getAllSoftware);
router.put('/software/:id', authMiddleware, updateSoftware);
router.delete('/software/:id', authMiddleware, deleteSoftware);

module.exports = router;
