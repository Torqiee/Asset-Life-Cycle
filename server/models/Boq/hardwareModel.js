const mongoose = require('mongoose');

const hardwareSchema = mongoose.Schema(
  {
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder', // Reference to the Folder model
      required: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },
    series: {
      type: String,
      required: [true, 'Series is required'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    site: {
      type: String,
      required: [true, 'Site TTC is required'],
    },
    createdBy: {
      type: String, // Store username as a string
      required: true,
    },
    updatedBy: {
      type: String, // Store username as a string
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Hardware', hardwareSchema);
