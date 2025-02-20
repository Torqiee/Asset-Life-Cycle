const Site = require('../../models/Project/siteModel');
const Order = require('../../models/Project/orderModel');

// Create Site
exports.createSite = async (request, response) => {
    try {
        const { orderId } = request.params;
        const site = new Site({
            ...request.body,
            orderId
        });

        const savedSite = await site.save();
        response.status(201).json({ success: true, data: savedSite });
    } catch (error) {
        console.error('Error:', error);
        response.status(400).json({ success: false, message: error.message });
    }
};

// Read all site order
exports.getAllSite = async (request, response) => {
    try {
      const { orderId } = request.params;
      const siteItems = await Site.find({ orderId }); // Filter site by orderId
      response.status(200).json({ data: siteItems });
    } catch (error) {
      response.status(500).json({ message: "Error fetching site data", error });
    }
};  

// Read all site on project
exports.getAllSitesByProject = async (request, response) => {
    try {
        const { projectId } = request.params;

        // Find all orders that belong to the given projectId
        const orders = await Order.find({ projectId }).select('_id');

        if (!orders.length) {
            return response.status(404).json({ message: "No orders found for this project." });
        }

        const orderIds = orders.map(order => order._id); // Extract all order IDs

        // Find all sites linked to those orders
        const sites = await Site.find({ orderId: { $in: orderIds } });

        response.status(200).json({ success: true, data: sites });
    } catch (error) {
        console.error("Error fetching sites by project:", error);
        response.status(500).json({ success: false, message: "Error fetching site data", error });
    }
};

// Delete site
exports.deleteSite = async (request, response) => {
    try {
        const deletedSite = await Site.findByIdAndDelete(request.params.id);
        if (!deletedSite) return response.status(404).json({ success: false, message: 'Site not found' });
        response.status(200).json({ success: true, message: 'Site deleted successfully' });
    } catch (error) {
        response.status(500).json({ success: false, message: error.message });
    }
};
