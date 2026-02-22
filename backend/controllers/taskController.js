const Project = require('../models/Project');
const Task = require('../models/Task');

// Create new task under a project
const createTask = async (req, res) => {
  try {
    const { title, description, status, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and Project ID required' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      project: projectId,
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

// Get all tasks for a specific project
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ project: projectId });

    res.status(200).json(tasks);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.project.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    // If status becomes completed, set completedAt
    if (status === 'completed') {
      task.completedAt = new Date();
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.project.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch(err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, getTasksByProject, updateTask, deleteTask };
