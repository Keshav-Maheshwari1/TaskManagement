import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // For generating random task IDs
import {
  createTask,
  deleteTaskById,
  fetchAllTasks,
  fetchAllUsers,
  updateTaskById,
} from "../constants/apiService";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]); // State for employees
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    assignedTo: "",
    dueDate: "",
  });

  const [editTaskId, setEditTaskId] = useState(null);
  const [updatedPriority, setUpdatedPriority] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  // Fetch tasks from server
  useEffect(() => {
    if (!email) {
      navigate("/"); // Redirect if no email is found
      return;
    }
    const fetchTasks = async () => {
      try {
        const role = "admin"; // Assume you have a way to get the current user's role
        const response = await fetchAllTasks(role);
        setTasks(response.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, [email, navigate]);

  // Fetch employees from server
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetchAllUsers();
        setEmployees(response.data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    };

    fetchEmployees();
  }, []);

  // Function to validate the due date
  const validateDueDate = (dueDate) => {
    return new Date(dueDate) > Date.now();
  };

  // Handle input changes for new task
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new task
  const handleAddTask = async () => {
    if (!validateDueDate(newTask.dueDate)) {
      alert("Due date must be in the future.");
      return;
    }

    const taskWithId = { ...newTask, taskId: uuidv4() };
    try {
      const role = "admin"; // Adjust based on current user
      const response = await createTask(taskWithId, role);
      setTasks((prev) => [...prev, response.data]);
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        assignedTo: "",
        dueDate: "",
      });
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  // Edit task priority
  const handleEditPriority = (taskId) => {
    setEditTaskId(taskId);
    const task = tasks.find((t) => t.taskId === taskId);
    setUpdatedPriority(task.priority);
  };

  const handleSavePriority = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.taskId === taskId ? { ...task, priority: updatedPriority } : task
    );

    setTasks(updatedTasks);
    setEditTaskId(null);
    setUpdatedPriority("");

    // Optional: Update the task on the server
    try {
      const role = "admin"; // Adjust based on current user
      await updateTaskById(taskId, { priority: updatedPriority }, role);
    } catch (err) {
      console.error("Failed to save priority:", err);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const role = "admin"; // Adjust based on current user
      await deleteTaskById(taskId, role);
      setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        Admin Task Management
      </h1>

      {/* Add Task Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Create Task
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="Task Title"
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <select
            name="assignedTo"
            value={newTask.assignedTo}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="" disabled>
              Select Employee
            </option>
            {employees.map((employee, index) => (
              <option
                key={employee.id || employee.email || index}
                value={employee.email}
              >
                {employee.email}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <select
            name="priority"
            value={newTask.priority}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            placeholder="Task Description"
            className="col-span-1 md:col-span-2 border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <button
          onClick={handleAddTask}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* Task Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Manage Tasks
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Task ID</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">
                  Assigned To
                </th>
                <th className="border border-gray-300 px-4 py-2">Priority</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.taskId || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {task.taskId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {task.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {task.assignedTo}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editTaskId === task.taskId ? (
                      <select
                        value={updatedPriority}
                        onChange={(e) => setUpdatedPriority(e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    ) : (
                      task.priority
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editTaskId === task.taskId ? (
                      <button
                        onClick={() => handleSavePriority(task.taskId)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditPriority(task.taskId)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.taskId)}
                      className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminPage;
