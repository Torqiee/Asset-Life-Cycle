const express = require('express');
const { createService, getAllServices, updateService, deleteService } = require('../../controllers/Boq/serviceController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/service/:folderId', authMiddleware, createService);
router.get('/service/:folderId', authMiddleware, getAllServices);
router.put('/service/:id', authMiddleware, updateService);
router.delete('/service/:id', authMiddleware, deleteService);

module.exports = router;
