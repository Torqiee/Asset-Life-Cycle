// models/Boq/folderModel.js
const mongoose = require('mongoose');

const boqSchema = mongoose.Schema({
  boqNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  projectName: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: String, 
    required: true 
  },
  status: {  // Added status field
    type: String,
    enum: ['On Review', 'Approved', 'Rejected', 'Draft'],  // Example statuses
    default: 'Draft',
  }
},{ 
  timestamps: true 
});

module.exports = mongoose.model('Boq', boqSchema);
