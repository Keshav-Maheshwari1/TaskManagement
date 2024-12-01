import axios from "axios";

const BACKEND_URI = import.meta.env.BACKEND_URI || "http://localhost:3001";

// Base Axios instance
const apiClient = axios.create({
  baseURL: `${BACKEND_URI}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------------- USERS API --------------------------

/**
 * Fetch all users (No role needed)
 * @returns {Promise} Axios response
 */
export const fetchAllUsers = async () => {
  return apiClient.get(`/users/`);
};

/**
 * Fetch a user by email (No role needed)
 * @param {string} email - User's email
 * @returns {Promise} Axios response
 */
export const fetchUserByEmail = async (email) => {
  return apiClient.get(`/users/${email}`);
};

/**
 * Update a user by email (No role needed)
 * @param {string} email - User's email
 * @param {Object} data - Data to update
 * @returns {Promise} Axios response
 */

/**
 * Delete a user by email (No role needed)
 * @param {string} email - User's email
 * @returns {Promise} Axios response
 */
export const deleteUserByEmail = async (email) => {
  return apiClient.delete(`/users/${email}`);
};

// -------------------------- TASKS API --------------------------

/**
 * Fetch tasks assigned to an employee (Role needed)
 * @param {string} email - Employee's email
 * @param {string} role - User's role for x-user-role header
 * @returns {Promise} Axios response
 */
export const fetchAssignedTasks = async (email, role) => {
  return apiClient.get(`/tasks/assigned/${email}`, {
    headers: { "x-user-role": role },
  });
};

/**
 * Update a task by task ID (Role needed: admin/employee)
 * @param {string} taskId - Task ID
 * @param {Object} data - Data to update
 * @param {string} role - User's role for x-user-role header
 * @returns {Promise} Axios response
 */
export const updateTaskById = async (taskId, data, role) => {
  return apiClient.put(`/tasks/${taskId}`, data, {
    headers: { "x-user-role": role },
  });
};

/**
 * Fetch all tasks (Role needed: admin)
 * @param {string} role - User's role for x-user-role header
 * @returns {Promise} Axios response
 */
export const fetchAllTasks = async (role) => {
  return apiClient.get(`/tasks/`, {
    headers: { "x-user-role": role },
  });
};

/**
 * Create a task (Role needed: admin)
 * @param {Object} data - Task data to create
 * @param {string} role - User's role for x-user-role header
 * @returns {Promise} Axios response
 */
export const createTask = async (data, role) => {
  return apiClient.post(`/tasks/`, data, {
    headers: { "x-user-role": role },
  });
};

/**
 * Delete a task by task ID (Role needed: admin)
 * @param {string} taskId - Task ID
 * @param {string} role - User's role for x-user-role header
 * @returns {Promise} Axios response
 */
export const deleteTaskById = async (taskId, role) => {
  return apiClient.delete(`/tasks/${taskId}`, {
    headers: { "x-user-role": role },
  });
};
