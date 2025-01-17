const Product = require('../models/productModel');
require('dotenv').config({ path: './.env' }); 

// Create a new product
exports.createProduct = async (request, response) => {
    const { name, description, price } = request.body;
  
    try {
      const newProduct = new Product({
        name,
        description,
        price,
        createdBy: request.username, // Use username instead of userId
      });
  
      const savedProduct = await newProduct.save();
      response.status(201).json({
        success: true,
        message: 'Product created successfully!',
        product: savedProduct,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, message: 'Error creating product' });
    }
};  

// Get all products
exports.getProducts = async (request, response) => {
    try {
      const products = await Product.find();
      response.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, message: 'Error fetching products' });
    }
};  

// Get a single product by ID
exports.getProduct = async (request, response) => {
    const { id } = request.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return response.status(404).json({ success: false, message: 'Product not found' });
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
      const product = await Product.findById(id);
      if (!product) {
        return response.status(404).json({ success: false, message: 'Product not found' });
      }
  
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.updatedBy = request.username; // Use username instead of userId
  
      const updatedProduct = await product.save();
      response.status(200).json({
        success: true,
        message: 'Product updated successfully!',
        product: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, message: 'Error updating product' });
    }
};  

// Delete a product
exports.deleteProduct = async (request, response) => {
    const { id } = request.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return response.status(404).json({ success: false, message: 'Product not found' });
      }
  
      // Use findByIdAndDelete or deleteOne to remove the product
      await Product.findByIdAndDelete(id); // This is the preferred method in Mongoose 6+
      
      response.status(200).json({
        success: true,
        message: 'Product deleted successfully!',
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, message: 'Error deleting product' });
    }
};  