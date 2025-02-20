// In your Order model file (e.g., models/Order.js)
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { 
        type: String, 
        required: true 
    },
    orderDate: {
        type: Date, 
        required: true 
    },
    vendor: { 
        type: String, 
        required: true 
    },
    boqNumber: { 
        type: String, 
        required: true 
    },
    nodinToReg: { 
        type: String, 
        required: true 
    },
    nodinToRegDate: { 
        type: Date, 
        required: true 
    },
    orderFile: { 
        type: String, 
        required: true 
    },
    nodinToRegFile: { 
        type: String, 
        required: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project' 
    },
    createdBy: {
        type: String 
    },
});

module.exports = mongoose.model('Order', orderSchema);