const express = require('express');
const { createOrder, getAllOrder, getAllOrders, updateOrder, deleteOrder } = require('../../controllers/Project/orderController');
const authMiddleware = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/multer');

const router = express.Router();

router.post('/order/:projectId', authMiddleware, 
    upload.fields([
      { name: 'orderFile', maxCount: 1 },
      { name: 'nodinToRegFile', maxCount: 1 }]), 
createOrder);
router.get('/order/:projectId', authMiddleware, getAllOrder);
router.get('/orders', authMiddleware, getAllOrders);
router.put('/order/:id', authMiddleware,
    upload.fields([
      { name: "orderFile", maxCount: 1 },
      { name: "nodinToRegFile", maxCount: 1 },
]), updateOrder);
router.delete('/order/:id', authMiddleware, deleteOrder);

module.exports = router;
