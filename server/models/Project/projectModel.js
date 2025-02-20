const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  projectName: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: String, 
    required: true 
  },
  nodinNumber: {
    type: String,
    required: true, 
    unique: true 
  },
  nodinDate: {
    type: String, 
    required: true 
  },
  nodinFile: {
    type: String,
    required: true, 
  },
  startDate: {
    type: String, 
    required: true 
  },
  endDate: {
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['On Review', 'Approved', 'Rejected', 'Draft'],  // Example statuses
    default: 'Draft',
  }
},{ 
  timestamps: true 
});

module.exports = mongoose.model('Project', projectSchema);
