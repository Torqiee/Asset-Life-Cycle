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

// Read all Purchase order by Project ID
exports.getAllOrder = async (request, response) => {
    try {
      const { projectId } = request.params;
      const orderItems = await Order.find({ projectId });
      response.status(200).json({ data: orderItems });
    } catch (error) {
      response.status(500).json({ message: "Error fetching order data", error });
    }
};  

// Read all Purchase order
exports.getAllOrders = async (request, response) => {
  try {
    const orderItems = await Order.find();
    response.status(200).json({ success: true, data: orderItems });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

// Update Purchase order
exports.updateOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const existingOrder = await Order.findById(id);
  
      if (!existingOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Updated Data (Text Fields)
      const updatedData = {
        orderNumber: req.body.orderNumber,
        orderDate: req.body.orderDate,
        vendor: req.body.vendor,
        boqNumber: req.body.boqNumber,
        nodinToReg: req.body.nodinToReg,
        nodinToRegDate: req.body.nodinToRegDate,
      };
  
      // Handle file uploads only if new files exist
      if (req.files && req.files.orderFile) {
        updatedData.orderFile = req.files.orderFile[0].path; // Save new file path
      } else {
        updatedData.orderFile = existingOrder.orderFile; // Keep old file
      }
  
      if (req.files && req.files.nodinToRegFile) {
        updatedData.nodinToRegFile = req.files.nodinToRegFile[0].path;
      } else {
        updatedData.nodinToRegFile = existingOrder.nodinToRegFile;
      }
  
      const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, { new: true });
  
      res.status(200).json({ data: updatedOrder });
    } catch (error) {
      res.status(500).json({ message: "Error updating order", error });
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