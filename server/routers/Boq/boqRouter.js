// routes/Boq/folderRouter.js
const express = require('express');
const { createFolder, getAllFolders, getFolderById, updateFolder, deleteFolder, updateFolderStatus, getFolderStatus, getBoqsByStatus } = require('../../controllers/Boq/boqController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/folder', authMiddleware, createFolder);
router.get('/folders', authMiddleware, getAllFolders);
router.get('/folder/:id', authMiddleware, getFolderById);
router.put('/folder/:id', authMiddleware, updateFolder);
router.delete('/folder/:id', authMiddleware, deleteFolder);
router.put('/folder/:id/status', authMiddleware, updateFolderStatus); // New route for status update
router.get('/folder/:id/status', authMiddleware, getFolderStatus); // New route for status update
router.get('/folder/status/:status', authMiddleware, getBoqsByStatus);

module.exports = router;
