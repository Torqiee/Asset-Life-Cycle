// controllers/Boq/folderController.js
const Folder = require('../../models/Boq/boqModel');

// Create a new folder
exports.createFolder = async (request, response) => {
  try {

    const folder = new Folder({ ...request.body, createdBy: request.username });
    const savedFolder = await folder.save();
    response.status(201).json({ success: true, data: savedFolder });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

// Get all folders
exports.getAllFolders = async (request, response) => {
  try {
    const folders = await Folder.find();
    response.status(200).json({ success: true, data: folders });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

// Get folder by ID
exports.getFolderById = async (request, response) => {
  try {
    const folder = await Folder.findById(request.params.id);
    if (!folder) return response.status(404).json({ success: false, message: 'Folder not found' });
    response.status(200).json({ success: true, data: folder });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

// Update folder
exports.updateFolder = async (request, response) => {
  try {
    // Check user role
    if (request.user.role !== 'Admin') {
      return response.status(403).json({ message: 'Unauthorized: Only Admins can update folder detail.' });
    }

    const updatedFolder = await Folder.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!updatedFolder) return response.status(404).json({ success: false, message: 'Folder not found' });
    response.status(200).json({ success: true, data: updatedFolder });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

exports.getFolderStatus = async (request, response) => {
  try {
    // Get folder ID from the route parameter
    const folderId = request.params.id;

    // Find the folder in the database
    const folder = await Folder.findById(folderId);

    // If folder not found, return 404
    if (!folder) {
      return response.status(404).json({ message: 'Folder not found' });
    }

    // Return the folder status
    response.json({ status: folder.status });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Server error' });
  }
};

// Update folder status
exports.updateFolderStatus = async (request, response) => {
  try {
    const { id } = request.params;
    const { status } = request.body;

    // Validate status
    if (!['On Review', 'Approved', 'Rejected'].includes(status)) {
      return response.status(400).json({ message: 'Invalid status value.' });
    }

    const folder = await Folder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!folder) {
      return response.status(404).json({ message: 'Folder not found.' });
    }

    response.status(200).json({
      message: `Folder status updated to ${status}.`,
      data: folder,
    });
  } catch (error) {
    console.error('Error updating folder status:', error);
    response.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete folder
exports.deleteFolder = async (request, response) => {
  try {
    // Check user role
    if (request.user.role !== 'Admin') {
      return response.status(403).json({ message: 'Unauthorized: Only Admins can delete the folder.' });
    }

    const deletedFolder = await Folder.findByIdAndDelete(request.params.id);
    if (!deletedFolder) return response.status(404).json({ success: false, message: 'Folder not found' });
    response.status(200).json({ success: true, message: 'Folder deleted successfully' });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

// Get BOQs based on status
exports.getBoqsByStatus = async (request, response) => {
  const { status } = request.params;

  try {
    // Validate the status (optional, but prevents invalid queries)
    const validStatuses = ['On Review', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return response.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Find all BOQs with the specified status
    const boqs = await Folder.find({ status });

    // Check if BOQs were found
    if (boqs.length === 0) {
      return response.status(404).json({ success: false, message: `No BOQs found with the status: ${status}` });
    }

    // Return the BOQs
    response.status(200).json({ success: true, data: boqs });
  } catch (error) {
    console.error('Error fetching BOQs by status:', error);
    response.status(500).json({ success: false, message: 'Internal server error' });
  }
};

