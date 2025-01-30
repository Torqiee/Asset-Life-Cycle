const Product = require('../models/productModel');
const mongoose = require('mongoose'); // Add this line to import mongoose
require('dotenv').config({ path: './.env' }); 

// Create a new product
exports.createProduct = async (request, response) => {
    const { name, description, price } = request.body;
  
    try {
      // Ensure `request.userId` is correctly set
      if (!request.userId) {
        return response.status(400).json({ success: false, message: 'User ID not found in request' });
      }
  
      const newProduct = new Product({
        name,
        description,
        price,
        createdBy: request.userId, // Use the userId set by the middleware
      });
  
      const savedProduct = await newProduct.save();
      response.status(201).json({
        success: true,
        message: 'Product created successfully!',
        product: savedProduct,
      });
    } catch (error) {
      console.error('Error creating product:', error.message);
      response.status(500).json({ success: false, message: 'Error creating product' });
    }
};
  
// Get all products
exports.getProducts = async (request, response) => {
    try {
      // Ensure `request.userId` is correctly set
      if (!request.userId) {
        return response.status(400).json({ success: false, message: 'User ID not found in request' });
      }
  
      const products = await Product.find({ createdBy: request.userId });
      response.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error('Error fetching products:', error.message);
      response.status(500).json({ success: false, message: 'Error fetching products' });
    }
};
  

// Get a single product by ID
exports.getProduct = async (request, response) => {
    const { id } = request.params;
    try {
      const product = await Product.findOne({ _id: id, createdBy: request.userId });
      if (!product) {
        return response.status(404).json({ success: false, message: 'Product not found or not authorized' });
      }
      response.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, message: 'Error fetching product' });
    }
};  

// Update a product
exports.updateProduct = async (request, response) => {
    const { id } = request.params;
    const { name, description, price } = request.body;
  
    try {
      const product = await Product.findOne({ _id: id, createdBy: request.userId });
      if (!product) {
        return response.status(404).json({ success: false, message: 'Product not found or not authorized' });
      }
  
      // Update fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.updatedBy = request.userId; // Set updatedBy to the current user
  
      const updatedProduct = await product.save();
      response.status(200).json({
        success: true,
        message: 'Product updated successfully!',
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error.message);
      response.status(500).json({ success: false, message: 'Error updating product' });
    }
};   

// Delete a product
exports.deleteProduct = async (request, response) => {
    const { id } = request.params;
  
    try {
      // Validate the product ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ success: false, message: 'Invalid product ID' });
      }
  
      // Find and delete the product
      const product = await Product.findOneAndDelete({ _id: id, createdBy: request.userId });
      if (!product) {
        return response.status(404).json({ success: false, message: 'Product not found or not authorized' });
      }
  
      response.status(200).json({ success: true, message: 'Product deleted successfully!' });
    } catch (error) {
      console.error("Error deleting product:", error.message);
      response.status(500).json({ success: false, message: 'Error deleting product' });
    }
};
  