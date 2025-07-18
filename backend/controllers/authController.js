
/**
 * Description: This file handles authentication controllers
 * Author: Fabio Kallina de Paula
 * Created: June 18, 2025
 */

import User from "../models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

/**
 * Created user registration for new user
 * @route POST /api/auth/register
 * @acess Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createRegistration = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if ( existingUser ) {
            return res.status(400).json({ 
                status: "error", 
                message: "This email has already been registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).json({
            token,
            user: { id: user._id, name, email },
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to register user",
            error: error.message,
        });
    }
}

/**
 * User LogIn
 * @route POST /api/auth/login
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const authLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: "error",
                error: "Invalid password",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email },
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to log in user",
            error: error.message,
        })
    }
}