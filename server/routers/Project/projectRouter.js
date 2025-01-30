const express = require('express');
const { createProject, getAllProjects, getProjectById, updateProject, deleteProject, updateProjectStatus, getProjectStatus } = require('../../controllers/Project/projectController');
const authMiddleware = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/multer');

const router = express.Router();

router.post('/project', authMiddleware, upload.single('nodinFile'), createProject);
router.get('/projects', authMiddleware, getAllProjects);
router.get('/project/:id', authMiddleware, getProjectById);
router.put('/project/:id', authMiddleware, updateProject);
router.delete('/project/:id', authMiddleware, deleteProject);
router.put('/project/:id/status', authMiddleware, updateProjectStatus); // New route for status update
router.get('/project/:id/status', authMiddleware, getProjectStatus); // New route for status update

module.exports = router;
