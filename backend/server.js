
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
const allowedOrigins = [
  "http://localhost:5173",
  "https://xhealthgpt.onrender.com"
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman, curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // if you want to support cookies/auth
}));

app.use(express.json());


//MongoDB connect
connectDB();

app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});