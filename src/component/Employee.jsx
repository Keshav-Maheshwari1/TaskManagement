import { useEffect, useState } from "react";
import {
  fetchAssignedTasks,
  fetchUserByEmail,
  updateTaskById,
} from "../constants/apiService";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const [tasks, setTasks] = useState([]); // Default empty array
  const [enableEdit, setEnableEdit] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        const userResponse = await fetchUserByEmail(email);
        setRole(userResponse.data.role);

        const tasksResponse = await fetchAssignedTasks(
          email,
          userResponse.data.role
        );
        if (
          tasksResponse &&
          tasksResponse.data &&
          Array.isArray(tasksResponse.data)
        ) {
          setTasks(tasksResponse.data);
        } else {
          setTasks([]); // Ensure tasks is always an array
        }
      } catch (err) {
        console.error("Error fetching user or tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchUserAndTasks();
    } else {
      navigate("/");
    }
  }, [email, navigate]);

  const handleEdit = (taskId, currentStatus) => {
    setEnableEdit(taskId);
    setUpdatedStatus(currentStatus);
  };

  const handleSave = async (taskId) => {
    try {
      const taskToUpdate = tasks.find((task) => task.taskId === taskId);
      await updateTaskById(
        taskId,
        { ...taskToUpdate, status: updatedStatus },
        role
      );
      setTasks(
        tasks.map((task) =>
          task.taskId === taskId ? { ...task, status: updatedStatus } : task
        )
      );
      setEnableEdit(null);
      setUpdatedStatus("");
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-700 text-center mb-8">
        Welcome, Employee!
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">Task Title</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Due Date</th>
              <th className="border border-gray-300 px-4 py-2">Priority</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <tr
                  key={task.taskId}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {task.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {task.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {task.dueDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {task.priority}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {enableEdit === task.taskId ? (
                      <select
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      task.status
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {enableEdit === task.taskId ? (
                      <button
                        onClick={() => handleSave(task.taskId)}
                        className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition duration-150"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(task.taskId, task.status)}
                        className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition duration-150"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No tasks assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Employee;
