const Task = require("../models/Task");
const Project = require("../models/Project");

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, project, priority, dueDate } = req.body;
        
        const projectExists = await Project.findById(project);
        if (!projectExists) return res.status(404).json({ message: "Project not found" });

        const task = new Task({
            title, description, assignedTo, project, priority, dueDate,
            createdBy: req.user._id
        });
        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const { projectId } = req.query;
        let query = {};
        
        if (projectId) {
            query.project = projectId;
            
            if (req.user.role !== 'admin') {
                const project = await Project.findById(projectId);
                if (!project || !project.members.some(m => m._id.equals(req.user._id))) {
                    return res.status(403).json({ message: "Not authorized to view tasks for this project" });
                }
            }
        } else if (req.user.role !== 'admin') {
            query.assignedTo = req.user._id;
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('project', 'projectName')
            .populate('createdBy', 'name email');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('project', 'projectName')
            .populate('createdBy', 'name email');
            
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (req.user.role !== 'admin') {
            const project = await Project.findById(task.project);
            if (!project.members.some(m => m._id.equals(req.user._id))) {
                return res.status(403).json({ message: "Not authorized" });
            }
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (req.user.role === 'admin') {
            const { title, description, assignedTo, priority, status, dueDate } = req.body;
            task.title = title || task.title;
            task.description = description !== undefined ? description : task.description;
            task.assignedTo = assignedTo || task.assignedTo;
            task.priority = priority || task.priority;
            task.status = status || task.status;
            task.dueDate = dueDate || task.dueDate;
        } else {
            if (!task.assignedTo || !task.assignedTo.equals(req.user._id)) {
                return res.status(403).json({ message: "Not authorized to update this task" });
            }
            if (req.body.status) {
                task.status = req.body.status;
            }
        }

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can delete tasks" });
        }
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.status(200).json({ message: "Task removed" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
