const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const getDashboardAnalytics = async (req, res) => {
    try {
        let matchStage = {};
        
        if (req.user.role !== 'admin') {
            matchStage.assignedTo = req.user._id;
        }

        const totalTasks = await Task.countDocuments(matchStage);

        const statusCounts = await Task.aggregate([
            { $match: matchStage },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const tasksPerUser = await Task.aggregate([
            { $match: matchStage },
            { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $project: { name: { $ifNull: ["$user.name", "Unassigned"] }, count: 1 } }
        ]);

        const currentDate = new Date();
        const overdueTasks = await Task.countDocuments({
            ...matchStage,
            dueDate: { $lt: currentDate },
            status: { $ne: 'Done' }
        });

        res.status(200).json({
            totalTasks,
            statusCounts,
            tasksPerUser,
            overdueTasks
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getDashboardAnalytics };
