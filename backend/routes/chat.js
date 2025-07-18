
import express from "express";

import { createChat, deleteChat, getChats } from "../controllers/chatController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", createChat);

router.get("/chats", getChats);

router.delete("/:id", deleteChat);

export default router;