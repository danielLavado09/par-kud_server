import express, { json } from "express";
import morgan from "morgan";
const app = express();
import cors from "cors";

// Import routes
import authRoutes from "./routes/authRoutes.js";

import parkingRoutes from "./routes/parkingRoutes.js";

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Routes
app.use(authRoutes);
app.use(parkingRoutes);

export default app;
