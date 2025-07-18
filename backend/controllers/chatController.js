/**
 * Description: This file handles chat controllers
 * Author: Fabio Kallina de Paula
 * Created: July 16, 20205
 */

import dotenv from "dotenv";
dotenv.config();

import Chat from "../models/Chat.js";

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Create chat data for the logged-in user
 * @route POST /api/chat
 * @access Private
 * @param {Object} req req - Express request object
 * @param {Object} res res - Express response object
 */
export const createChat = async (req, res) => {
  const userId = req.user.id;
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Message history is required." });
  }

  try {
    const formattedMessages = [
      {
        role: "system",
        content:
          "You are a cautious health assistant. You give helpful, general advice, avoid diagnosis or medication suggestions, and encourage users to see a healthcare provider.",
      },
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ];

    const aiRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
    });
    console.log(aiRes);
    const reply = aiRes.choices[0].message.content;

    const fullMessages = [...messages, { sender: "ai", text: reply }];

    const chat = new Chat({ userId, messages: fullMessages });
    await chat.save();

    res.json({ response: reply });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create chat message",
      error: error.message,
    });
  }
};

/**
 * Retrieve chat data for the logged-in user
 * @route GET /api/chat
 * @access Private
 * @param {Object} req req - Express request object
 * @param {Object} res res - Express response object
 */
export const getChats = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    const chats = await Chat.find({ userId });
    res.status(200).json({ status: "success", data: chats });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch chats",
      error: error.message,
    });
  }
};

/**
 * Delete chat for the logged-in user
 * @route DELETE /api/chat/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteChat = async (req, res) => {
  const { id } = req.params;

  try {
    const chat = await Chat.findOneAndDelete({
      _id: id, 
      userId: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        status: "error",
        message: "Could not find chat or you do not have permission to delete it"
      });
    }
    res.status(200).json({ status: "success", message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete chat",
      error: error.message,
    });
  }
}
