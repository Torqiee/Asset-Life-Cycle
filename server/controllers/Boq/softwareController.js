const Software = require('../../models/Boq/softwareModel');

// Create software
exports.createSoftware = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admins can add the software data.' });
        }

        const { folderId } = request.params; // Get folderId from URL params
        const software = new Software({ 
            ...request.body, 
            folderId,
            createdBy: request.username
         });
        const savedSoftware = await software.save();
        response.status(201).json({ success: true, data: savedSoftware });
    } catch (error) {
        response.status(400).json({ success: false, message: error.message });
    }
};

// Read all software
exports.getAllSoftware = async (request, response) => {
    try {
        const { folderId } = request.params;
        const software = await Software.find({ folderId });
        response.status(200).json({ success: true, data: software });
    } catch (error) {
        response.status(500).json({ success: false, message: error.message });
    }
};

// Update software
exports.updateSoftware = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admins can edit the software data.' });
        }

        const updatedSoftware = await Software.findByIdAndUpdate(
            request.params.id,
            { ...request.body, updatedBy: request.username },
            { new: true }
        );
        if (!updatedSoftware) return response.status(404).json({ success: false, message: 'Software not found' });
        response.status(200).json({ success: true, data: updatedSoftware });
    } catch (error) {
        response.status(400).json({ success: false, message: error.message });
    }
};

// Delete software
exports.deleteSoftware = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admins can delete the software data.' });
        }

        const deletedSoftware = await Software.findByIdAndDelete(request.params.id);
        if (!deletedSoftware) return response.status(404).json({ success: false, message: 'Software not found' });
        response.status(200).json({ success: true, message: 'Software deleted successfully' });
    } catch (error) {
        response.status(500).json({ success: false, message: error.message });
    }
};
