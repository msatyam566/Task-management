const Task = require('../models/task.model');

exports.getTaskAnalytics = async (req, res) => {
  try {
    const completedTasks = await Task.countDocuments({ status: 'Completed' }); // Tasks that are completed
    const pendingTasks = await Task.countDocuments({ status: 'In Progress' }); // Tasks that are in progress
    const overdueTasks = await Task.countDocuments({ dueDate: { $lt: Date.now() }, status: { $ne: 'Pending' } }); // Tasks that are not completed due date

    res.status(200).json({
      completedTasks,
      pendingTasks,
      overdueTasks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
