const mongoose = require('mongoose');

const hardwareSchema = new mongoose.Schema(
  {
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

const softwareSchema = new mongoose.Schema(
    {
      brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true,
      },
      series: {
        type: String,
        required: [true, 'Series is required'],
      },
      license: {
        type: String,
        required: [true, 'License is required'],
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

const serviceSchema = new mongoose.Schema(
    {
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

const Hardware = mongoose.model('Hardware', hardwareSchema);
const Software = mongoose.model('Software', softwareSchema);
const Service = mongoose.model('Service', serviceSchema);

module.exports = { Hardware, Software, Service };
