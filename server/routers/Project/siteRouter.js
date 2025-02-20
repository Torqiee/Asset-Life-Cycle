const express = require('express');
const { createSite, getAllSite, getAllSitesByProject, deleteSite } = require('../../controllers/Project/siteController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/site/:orderId', authMiddleware, createSite);
router.get('/site/:orderId', authMiddleware, getAllSite);
router.get('/site/project/:projectId', authMiddleware, getAllSitesByProject);
router.delete('/site/:id', authMiddleware, deleteSite);

module.exports = router;