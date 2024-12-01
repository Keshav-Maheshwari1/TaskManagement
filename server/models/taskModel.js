import mongoose from "mongoose"; // For generating unique task IDs

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      unique: true,
      required: true, 
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > Date.now(); // Ensure due date is in the future
        },
        message: "Due date cannot be in the past.",
      },
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    assignedTo: {
      type: String, // Store the email of the user
      required: true,
      validate: {
        validator: function (value) {
          // Simple email regex validation
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
