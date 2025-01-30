const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
    {
      folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder', // Reference to the Folder model
        required: true,
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
      },
      license: {
        type: String,
        required: [true, 'License is required'],
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

module.exports = mongoose.model('Service', serviceSchema);
