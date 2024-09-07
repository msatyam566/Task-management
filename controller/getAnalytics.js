const Task = require('../models/task.model');

exports.getTaskAnalytics = async (req, res) => {
  try {
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    const overdueTasks = await Task.countDocuments({ dueDate: { $lt: Date.now() }, status: { $ne: 'Completed' } });

    res.json({
      completedTasks,
      pendingTasks,
      overdueTasks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
