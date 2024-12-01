import mongoose from "mongoose";
const ConnectionString =
  process.env.MONGO_URI ||
  "mongodb+srv://mrkeshav:keshavmaheshwari@cluster0.qvlon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    await mongoose.connect(ConnectionString);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
