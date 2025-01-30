const mongoose = require('mongoose');

const poSchema = mongoose.Schema(
  {
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site', // Reference to the Site model
      required: true,
    },
    site: {
      type: String,
      required: [true, 'Site is required'],
      trim: true,
    }
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Site', poSchema);
