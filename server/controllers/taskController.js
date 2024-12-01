import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get all tasks assigned to a specific user by email
export const getAssignedTask = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.tasks); // Return tasks array directly from user
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status, priority } = req.body;

  try {
    const task = await Task.findOne({ taskId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "employee" && task.priority !== priority) {
      return res
        .status(403)
        .json({ msg: "Access denied. You can only update your own tasks." });
    }
    if (req.user.role === "admin" && task.status !== status) {
      return res
        .status(403)
        .json({ msg: "Access denied. You can only update your own tasks." });
    }

    task.status = status;
    task.priority = priority;
    await task.save();

    const user = await User.findOne({ email: task.assignedTo });
    if (user) {
      const taskIndex = user.tasks.findIndex((t) => t.taskId === taskId);
      if (taskIndex > -1) {
        user.tasks[taskIndex].status = status;
        user.tasks[taskIndex].priority = priority;
        await user.save();
      }
    }

    res.status(200).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  const { taskId, title, description, dueDate, priority, assignedTo } =
    req.body;

  try {
    // Check if taskId already exists in the Task collection
    const existingTask = await Task.findOne({ taskId });
    if (existingTask) {
      return res.status(400).json({ message: "Task ID already exists." });
    }

    // Create a new task
    const newTask = new Task({
      taskId, // Custom task ID
      title,
      description,
      dueDate,
      priority,
      status: "pending", // Default status for new tasks
      assignedTo, // Email of the user assigned to the task
    });

    await newTask.save();

    // Find the user by assigned email
    const user = await User.findOne({ email: assignedTo });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new task to the user's tasks array
    user.tasks.push({
      taskId,
      title,
      description,
      dueDate,
      priority,
      status: "pending", // Default status
    });
    await user.save(); // Save the user with the new task

    res.status(201).json(newTask); // Return the created task
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Ensure only admins can delete tasks
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    // Find the task by taskId
    const task = await Task.findOne({ taskId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Find the user associated with the task and remove it from their tasks
    const user = await User.findOne({ email: task.assignedTo });
    await Task.deleteOne(task); // Delete the task

    // Remove the task from the user's tasks array
    if (user) {
      user.tasks = user.tasks.filter((taskObj) => taskObj.taskId !== taskId);
      await user.save(); // Save the updated user
    }

    res.status(200).json({ message: "Task deleted successfully" }); // Return success message
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
