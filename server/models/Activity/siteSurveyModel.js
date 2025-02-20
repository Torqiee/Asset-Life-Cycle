const mongoose = require('mongoose');

const siteSurveySchema = new mongoose.Schema({
    // Data General
    location: { 
        type: String, 
        required: true 
    },
    job: {
        type: String, 
        required: true 
    },
    poNumber: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    rackbrandSeries: { 
        type: String, 
    },  
    rackCapacity: { 
        type: Number, 
    },
    rackTotal: { 
        type: Number, 
    },
    rackDimension: { 
        type: String, 
    },

    // Detail Perangkat
    deviceIdRack: {
        type: String, 
        required: true 
    },
    deviceFloor: {
        type: Number, 
        required: true 
    },
    deviceRoomName: {
        type: String, 
        required: true 
    },
    deviceRackCoor: {
        type: String, 
        required: true 
    },
    deviceUPosition: {
        type: String, 
        required: true 
    },
    deviceProjectOrService: {
        type: String, 
        required: true 
    },
    deviceType: {
        type: String, 
        default: '', 
        enum: ['Appliance Datacom', 'Appliance Security', 'Backup Restore', 'Cable Management', 'KVM', 'Router', 'SAN Switch', 'Server', 'Storage', 'Switch', 'Tapping Device', 'Other'] 
    },  
    deviceBrand: {
        type: String, 
        required: true 
    },
    deviceSeries: {
        type: String, 
        required: true 
    },
    deviceCurrent: {
        type: String, 
        default: '', 
        enum: ['AC', 'DC']
    },
    deviceWatt: {
        type: Number, 
        required: true 
    },

    // Power Rack A

    
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project' 
    },
    createdBy: {
        type: String 
    },
});

module.exports = mongoose.model('Survey', siteSurveySchema);