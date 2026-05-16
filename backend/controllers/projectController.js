const Project = require("../models/Project");

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    try {
        const { projectName, description, members } = req.body;
        const project = new Project({
            projectName,
            description,
            members: members || [],
            createdBy: req.user._id,
        });
        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        // Admins see all projects, members see projects they are added to.
        let projects;
        if (req.user.role === 'admin') {
            projects = await Project.find({}).populate('members', 'name email').populate('createdBy', 'name email');
        } else {
            projects = await Project.find({ members: req.user._id }).populate('members', 'name email').populate('createdBy', 'name email');
        }
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('members', 'name email').populate('createdBy', 'name email');
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        
        // Only admins and assigned members can view project details
        if (req.user.role !== 'admin' && !project.members.some(member => member._id.equals(req.user._id))) {
             return res.status(403).json({ message: "Not authorized to view this project" });
        }
        
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    try {
        const { projectName, description, members } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.projectName = projectName || project.projectName;
        project.description = description !== undefined ? description : project.description;
        if (members) project.members = members;

        const updatedProject = await project.save();
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await project.deleteOne();
        res.status(200).json({ message: "Project removed" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};
