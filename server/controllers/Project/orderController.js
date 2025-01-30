const Order = require('../../models/Project/orderModel');

// Create Purchase Order
exports.createOrder = async (request, response) => {
    try {
        if (!request.files || !request.files.orderFile || !request.files.nodinToRegFile) {
            return response.status(400).json({
                success: false,
                message: 'Both orderFile and nodinToRegFile are required.',
            });
        }

        const { projectId } = request.params;
        const order = new Order({
            ...request.body,
            projectId,
            createdBy: request.username,
            orderFile: request.files.orderFile[0].path,  // Save file path
            nodinToRegFile: request.files.nodinToRegFile[0].path,  // Save file path
        });

        const savedOrder = await order.save();
        response.status(201).json({ success: true, data: savedOrder });
    } catch (error) {
        console.error('Error:', error);
        response.status(400).json({ success: false, message: error.message });
    }
};

// Read all Purchase order
exports.getAllOrder = async (request, response) => {
    try {
      const { projectId } = request.params;
      const orderItems = await Order.find({ projectId }); // Filter Order by projectId
      response.status(200).json({ data: orderItems });
    } catch (error) {
      response.status(500).json({ message: "Error fetching order data", error });
    }
};  

// Update Purchase order
exports.updateOrder = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admins can edit the Purchase Order data.' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            request.params.id,
            { ...request.body, updatedBy: request.username },
            { new: true }
        );
        if (!updatedOrder) return response.status(404).json({ success: false, message: 'Order not found' });
        response.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        response.status(400).json({ success: false, message: error.message });
    }
};

// Delete Purchase order
exports.deleteOrder = async (request, response) => {
    try {
        // Check user role
        if (request.user.role !== 'Admin') {
            return response.status(403).json({ message: 'Unauthorized: Only Admins can delete the Purchase Order data.' });
        }

        const deletedOrder = await Order.findByIdAndDelete(request.params.id);
        if (!deletedOrder) return response.status(404).json({ success: false, message: 'Order not found' });
        response.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        response.status(500).json({ success: false, message: error.message });
    }
};
