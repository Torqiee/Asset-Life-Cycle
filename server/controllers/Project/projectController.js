const Project = require('../../models/Project/projectModel');

// Create a new project
exports.createProject = async (request, response) => {
    try {
      // Check user role
  
      // Extract form data from request body
      const { projectName, nodinNumber, nodinDate, startDate, endDate } = request.body;
      
      // Handle file upload
      const nodinFile = request.file ? request.file.path : null;
  
      if (!nodinFile) {
        return response.status(400).json({ success: false, message: 'Nodin file is required.' });
      }
  
      // Create new project with uploaded file path
      const project = new Project({
        projectName,
        createdBy: request.username,
        nodinNumber,
        nodinDate,
        nodinFile, // Store file path
        startDate,
        endDate,
      });
  
      const savedProject = await project.save();
      response.status(201).json({ success: true, data: savedProject });
    } catch (error) {
      response.status(400).json({ success: false, message: error.message });
    }
};

// Get all projects
exports.getAllProjects = async (request, response) => {
  try {
    const projects = await Project.find();
    response.status(200).json({ success: true, data: projects });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

// Get project by ID
exports.getProjectById = async (request, response) => {
  try {
    const project = await Project.findById(request.params.id);
    if (!project) return response.status(404).json({ success: false, message: 'Project not found' });
    response.status(200).json({ success: true, data: project });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
};

// Update project
exports.updateProject = async (request, response) => {
  try {
    // Check user role
    if (request.user.role !== 'Admin') {
      return response.status(403).json({ message: 'Unauthorized: Only Admins can update project detail.' });
    }

    const updatedProject = await Project.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!updatedProject) return response.status(404).json({ success: false, message: 'Project not found' });
    response.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

exports.getProjectStatus = async (request, response) => {
  try {
    // Get project ID from the route parameter
    const projectId = request.params.id;

    // Find the project in the database
    const project = await Project.findById(projectId);

    // If project not found, return 404
    if (!project) {
      return response.status(404).json({ message: 'Project not found' });
    }

    // Return the project status
    response.json({ status: project.status });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Server error' });
  }
};

// Update project status
exports.updateProjectStatus = async (request, response) => {
  try {
    const { id } = request.params;
    const { status } = request.body;

    // Check user role
    // if (request.user.role !== 'Admin') {
    //   return response.status(403).json({ message: 'Unauthorized: Only Admins can update the project status.' });
    // }

    // Validate status
    if (!['On Review', 'Approved', 'Rejected'].includes(status)) {
      return response.status(400).json({ message: 'Invalid status value.' });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!project) {
      return response.status(404).json({ message: 'Project not found.' });
    }

    response.status(200).json({
      message: `Project status updated to ${status}.`,
      data: project,
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    response.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete project
exports.deleteProject = async (request, response) => {
    try {
      // Check user role

      const deletedProject = await Project.findByIdAndDelete(request.params.id);
      if (!deletedProject) return response.status(404).json({ success: false, message: 'Project not found' });
      response.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      response.status(500).json({ success: false, message: error.message });
    }
  };