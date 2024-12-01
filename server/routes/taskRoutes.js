import express from "express";
import {
  getAllTasks,
  getAssignedTask,
  updateTaskStatus,
  createTask,
  deleteTask,
} from "../controllers/taskController.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Employee-only routes
router.get("/assigned/:email", allowRoles("employee"), getAssignedTask);
router.put("/:taskId", allowRoles("employee","admin"), updateTaskStatus);

// Admin-only routes
router.get("/", allowRoles("admin"), getAllTasks);
router.post("/", allowRoles("admin"), createTask);
router.delete("/:taskId", allowRoles("admin"), deleteTask);

export default router;
