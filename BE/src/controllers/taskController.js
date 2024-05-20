const Task = require("../models/Task");
const _ = require("lodash");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    const transformedTasks = _.map(tasks, task => {
      return _.assign({}, task.toObject(), { newProperty: "value" });
    });
    res.json(transformedTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    _.merge(task, req.body);
    const updatedTask = await task.save();
    console.log("Updated Task:", updatedTask);
    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
