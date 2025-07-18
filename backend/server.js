
import express from "express";
import  cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));

//MongoDB connect
connectDB();

app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});