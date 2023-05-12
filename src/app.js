import express, { json } from "express";
import morgan from "morgan";
const app = express();

// Import routes
import authRoutes from "./routes/authRoutes.js";

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use(authRoutes);

export default app;
