const sendEmail = require('../functions/sendEmail');
const Task = require('../models/task.model');
const userModel = require('../models/user.model');

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

    const getEmailToSendNotification = await userModel.findById(task.assignedTo);
    const getEmail = getEmailToSendNotification.email


    // Prepare email details
    const emailList = [getEmail];
    const emailBody = `
      <h3>New Task Assigned: ${title}</h3>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Due Date:</strong> ${dueDate}</p>
      <p><strong>Priority:</strong> ${priority}</p>
      <p><strong>Status:</strong> ${status}</p>
    `;

    // Send notification email
    console.log(sendEmail)
    await sendEmail(emailList, emailBody);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).send({ messege: 'Server error', data: err.message });

  }
};



// Api to fetch all tasks

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

    res.status(200).json({ messege: "Tasks fetched succesfully", data: tasks, count: tasks.length });
  } catch (err) {
    res.status(500).send({ messege: 'Server error', data: err.message });

  }
};


// Api to update task by manager and admin

exports.updateTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  const taskFields = { title, description, dueDate, priority, status, assignedTo };

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, { $set: taskFields }, { new: true });


    res.status(200).json({ messege: "Task is updated", data: task });
  } catch (err) {

    res.status(500).send({ messege: 'Server error', data: err.message });
  }
};

// Api to delete task

exports.deleteTask = async (req, res) => {
  try {
    const getTaskId = req.params.id
    let task = await Task.findById(getTaskId);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: 'Task removed succesfully' });
  } catch (err) {
    res.status(500).send({ messege: 'Server error', data: err.message });
  }
};

