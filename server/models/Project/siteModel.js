const mongoose = require('mongoose');

const poSchema = mongoose.Schema(
  {
    site: {
      type: String,
      required: [true, 'Site is required'],
      trim: true,
    },
    startDate: {
      type: Date, 
      required: true 
    },
    endDate: {
      type: Date, 
      required: true 
    },
    orderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Order' 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project' 
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Site', poSchema);
