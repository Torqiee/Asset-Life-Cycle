const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have an auth middleware to check the user

const router = express.Router();

// Create a new product
router.post('/products', authMiddleware, productController.createProduct);

// Get all products
router.get('/products', productController.getProducts);

// Get a single product by ID
router.get('/products/:id', productController.getProduct);

// Update a product
router.put('/products/:id', authMiddleware, productController.updateProduct);

// Delete a product
router.delete('/products/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
