const Service = require('../../models/Boq/serviceModel');

// Create service
exports.createService = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Users can create the service data.' });
        }

        const { folderId } = request.params; // Get folderId from URL params
        const service = new Service({ 
            ...request.body, 
            folderId, 
            createdBy: request.username 
        });
        const savedService = await service.save();
        response.status(201).json({ success: true, data: savedService });
    } catch (error) {
        response.status(400).json({ success: false, message: error.message });
    }
};

// Read all services
exports.getAllServices = async (request, response) => {
    try {
        const { folderId } = request.params;
        const services = await Service.find({ folderId });
        response.status(200).json({ success: true, data: services });
    } catch (error) {
        response.status(500).json({ success: false, message: error.message });
    }
}; 

// Update service
exports.updateService = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admin can update the service data.' });
        }

        const updatedService = await Service.findByIdAndUpdate(
            request.params.id,
            { ...request.body, updatedBy: request.username },
            { new: true }
        );
        if (!updatedService) return response.status(404).json({ success: false, message: 'Service not found' });
        response.status(200).json({ success: true, data: updatedService });
    } catch (error) {
        response.status(400).json({ success: false, message: error.message });
    }
};

// Delete service
exports.deleteService = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admin can delete the service data.' });
        }

        const deletedService = await Service.findByIdAndDelete(request.params.id);
        if (!deletedService) return response.status(404).json({ success: false, message: 'Service not found' });
        response.status(200).json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        response.status(500).json({ success: false, message: error.message });
    }
};
