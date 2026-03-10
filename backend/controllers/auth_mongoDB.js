import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from 'node:crypto';
import User from '../models/User.js';
import redisClient from '../redis/redisClient.js';
import sendEmail from '../utils/sendEmail.js';

const users = []; // In-memory user store
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;


/**
 * @description Registers a new user and saves them to MongoDB.
 * @route POST /api/register
 * @access Public
 * @param {import('express').Request} req - Express request object containing `email`, `password`, and optional `role` in the body.
 * @param {import('express').Response} res - Express response object used to send back HTTP status and messages.
 */
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'Admin',
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @description Logs in a user, generates tokens, stores refresh token in Redis
 * @route POST /api/login
 * @access Public
 */
export const login = async(req, res, next) => {
    try {
        console.log("login route hit")
        debugger;
        const { email, password } = req.body;
        //const user = users.find(u => u.email === email);
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ email }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
        await redisClient.set(user._id.toString(), refreshToken, { EX: 7 * 24 * 60 * 60 }); // store for 7 days

        res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            })
        .json({ accessToken });
    } catch (err) {
        next(err);
    }
};

// refresh token
export const refresh = async(req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);
    const stored = await redisClient.get(payload.id);
    if (stored !== oldRefreshToken) throw new Error('Invalid refresh token');

    const accessToken = jwt.sign({ email: payload.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch {
    res.sendStatus(403);
  }
};

/**
 * Logs out a user by removing their session from Redis and clearing the refresh token cookie.
 *
 * @async
 * @function logout
 * @param {import('express').Request} req - Express request object, expected to contain the user ID (e.g., req.user.id).
 * @param {import('express').Response} res - Express response object, used to clear cookies and send the response.
 * @returns {Promise<void>} Sends HTTP 204 No Content on successful logout.
 *
 * @example
 * // Example usage in a route:
 * router.post('/logout', logout);
 */
export const logout = async (req, res) => {
  const { userId } = req.body;
  await redisClient.del(userId); // userId should be retrieved from req (e.g., req.user.id)
  res.clearCookie('refreshToken');
  res.sendStatus(204);
};


// Protected route
export const profile = async(req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ email: user.email, role: user.role });
  } catch {
    res.sendStatus(403);
  }
};

/**
 * @desc    Handle forgot password request
 * @route   POST /auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    debugger;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Email not found' });

    const token = randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hr
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    await sendEmail(email, 'Reset Password', `Reset here: ${resetUrl}`);

    res.json({ message: 'Password reset link sent to email' });
  } catch (err) {
      next(err);
  }
};

/**
 * @desc    Reset user password
 * @route   POST /auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    console.log('In resetPassword');
    const { token } = req.params; // comes from URL
    const { password } = req.body; // comes from request body
    console.log(token, password);
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }
    const user = await User.findOne({ resetToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined; // clear token
    user.resetTokenExpiry = undefined; // clear expiry
    await user.save();
    console.log('saved');
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Internal server error" });
  }

};


