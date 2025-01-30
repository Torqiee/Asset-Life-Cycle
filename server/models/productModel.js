const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Product', productSchema);
