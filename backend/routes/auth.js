
/**
 * Authorization Routes
 * Handles all authorization-related endpoints
 * Author: Fabio Kallina de Paula
 * Created: July 18, 2025
 */

import express from "express";
import dotenv from "dotenv";
import { authLogin, createRegistration } from "../controllers/authController.js";

dotenv.config();

const router = express.Router();

//REGISTER
router.post("/register", createRegistration);
//LOGIN
router.post("/login", authLogin);

export default router;