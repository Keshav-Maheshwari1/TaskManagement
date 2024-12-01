import express from "express";
import "./loadEnvironment.js";
import connectDB from "./db/connection.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { mockUserMiddleware } from "./middleware/roleMiddleware.js";

connectDB();
const corsOptions = {
  origin: "*", // Replace with specific origin(s) for production
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-user-role", // Add any custom headers you expect in requests
  ],
};


const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Mock user role middleware
app.use(mockUserMiddleware);

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
