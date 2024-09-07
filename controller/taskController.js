const Task = require('../models/task.model');

exports.createTask = async (req, res) => {

  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      createdBy: req.user._id
    });

    const task = await newTask.save();
    // Emit real-time event when a new task is created
    global.io.emit('taskCreated', task);

    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getTasks = async (req, res) => {
  try {
    let tasks;
    const { status, priority, dueDate } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    const userRoles = req.user.role;

    if (userRoles.includes('admin')) {
      tasks = await Task.find(query).populate('assignedTo', 'username email');
    } else if (userRoles.includes('manager')) {
      tasks = await Task.find(query).populate('assignedTo', 'username email');
    } else {
      tasks = await Task.find({
        $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }]
      }).populate('assignedTo', 'username email');
    }

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  const taskFields = { title, description, dueDate, priority, status, assignedTo };

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, { $set: taskFields }, { new: true });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }


    await Task.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

