const Hardware = require('../../models/Boq/hardwareModel');

// Create hardware
exports.createHardware = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admins can add the hardware data.' });
        }

        const { folderId } = request.params; // Get folderId from URL params
        const hardware = new Hardware({
            ...request.body,
            folderId, // Add folderId to hardware data
            createdBy: request.username,
        });
        const savedHardware = await hardware.save();
        response.status(201).json({ success: true, data: savedHardware });
    } catch (error) {
        response.status(400).json({ success: false, message: error.message });
    }
};

// Read all hardware
exports.getAllHardware = async (request, response) => {
    try {
      const { folderId } = request.params;
      const hardwareItems = await Hardware.find({ folderId }); // Filter hardware by folderId
      response.status(200).json({ data: hardwareItems });
    } catch (error) {
      response.status(500).json({ message: "Error fetching hardware data", error });
    }
};  

// Update hardware
exports.updateHardware = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admins can edit the hardware data.' });
        }

        const updatedHardware = await Hardware.findByIdAndUpdate(
            request.params.id,
            { ...request.body, updatedBy: request.username },
            { new: true }
        );
        if (!updatedHardware) return response.status(404).json({ success: false, message: 'Hardware not found' });
        response.status(200).json({ success: true, data: updatedHardware });
    } catch (error) {
        response.status(400).json({ success: false, message: error.message });
    }
};

// Delete hardware
exports.deleteHardware = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admins can delete the hardware data.' });
        }

        const deletedHardware = await Hardware.findByIdAndDelete(request.params.id);
        if (!deletedHardware) return response.status(404).json({ success: false, message: 'Hardware not found' });
        response.status(200).json({ success: true, message: 'Hardware deleted successfully' });
    } catch (error) {
        response.status(500).json({ success: false, message: error.message });
    }
};
