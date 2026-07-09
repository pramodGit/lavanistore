import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { pool } from "../db.js";
import redisClient from "../redis/redisClient.js";

import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  ConflictError,
  NotFoundError,
  DatabaseError,
} from "../errors/AppError.js";

import sendEmail from "../utils/sendEmail.js";
// import { publishToQueue } from "../rabbitmq/rabbitmq.js";
import registrationEmailTemplate from "../utils/registrationEmail.js";
import forgotPasswordEmailTemplate from "../utils/forgotPasswordEmail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

/**
 * Helper: Generate unique Lavani username (e.g. LW123456)
 */
const generateUniqueUserName = async (connection) => {
  let userName;
  let isUnique = false;

  while (!isUnique) {
    userName = "LW" + Math.floor(100000 + Math.random() * 900000);
    const [rows] = await connection.query(
      "SELECT RegistrationID FROM user_login WHERE UserName = ?",
      [userName]
    );
    if (rows.length === 0) isUnique = true;
  }
  return userName;
};

/**
 * @desc Register a new user and send credentials email
 * @route POST /api/register
 * @access Public
 */
export const register = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      firstName,
      middleName,
      lastName,
      mobile,
      email,
      password,
      sponsorId,
      createdBy,
    } = req.body;

    await connection.beginTransaction();

    // 1️⃣ Check duplicate user
    const [existing] = await connection.query(
      "SELECT * FROM user_registration_basic WHERE `EmailID` = ?",
      [email]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Insert into user_registration_basic
    const [basicResult] = await connection.query(
      `INSERT INTO user_registration_basic
       (\`First Name\`, \`Middle Name\`, \`Last Name\`, \`Mobile No\`, \`EmailID\`, \`SponserShipID\`, \`CreatedDate\`, \`CreatedBy\`)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        firstName,
        middleName || null,
        lastName,
        mobile,
        email,
        sponsorId || null,
        createdBy || "system",
      ]
    );

    const registrationId = basicResult.insertId;
    const userName = await generateUniqueUserName(connection);

    // 3️⃣ Hash password if needed
    const hashedPassword = password; // can use bcrypt if desired

    // 4️⃣ Insert into user_login
    await connection.query(
      `INSERT INTO user_login (RegistrationID, UserName, UserPassword, LoginDate, IsBlocked)
       VALUES (?, ?, ?, NOW(), 'NO')`,
      [registrationId, userName, hashedPassword]
    );

    // 5️⃣ Insert into user_registration_profile
    await connection.query(
      `INSERT INTO user_registration_profile (RegistrationID, CreatedUpdatedBy, CreatedUpdatedDate)
       VALUES (?, ?, NOW())`,
      [registrationId, createdBy || "system"]
    );

    // ✅ Skip role_master and mapping

    await connection.commit();

    // 6️⃣ Send registration email
    const subject = "Welcome to Lavani – Your Account Details";
    const { html, text } = registrationEmailTemplate(userName, password, firstName);

    try {
      await sendEmail(email, subject, { html, text });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    // 7️⃣ Generate JWT tokens
    const accessToken = jwt.sign({ email, role: "User" }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ email }, REFRESH_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully, credentials sent to email",
      registrationId,
      userName,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Registration error:", err);
    await connection.rollback();
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    connection.release();
  }
};



/**
 * @desc Login a user and generate tokens
 * @route POST /api/login
 * @access Public
 */
export const login = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { userName, password } = req.body;

    // Find user
    const [rows] = await connection.query(
      "SELECT * FROM user_login WHERE UserName = ?",
      [userName]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = comparePlainPasswords(password, user.UserPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fetch user's email from registration table (optional)
    const [userDetails] = await connection.query(
      "SELECT EmailID FROM user_registration_basic WHERE RegistrationID = ?",
      [user.RegistrationID]
    );

    const email = userDetails[0]?.EmailID || null;

    // ✅ Correct payload — use UserID and UserName
    const accessToken = jwt.sign(
      {
        id: user.UserID,          // use primary key
        registrationId: user.RegistrationID,
        userName: user.UserName,  // match DB column
        email: email,
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.UserID,
        registrationId: user.RegistrationID,
        userName: user.UserName,
      },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Get IsGreen from Green_User_List
    const [greenRows] = await connection.query(`SELECT IsGreen FROM Green_User_List WHERE UserName = ?`, [user.UserName]);
    
    const isGreen = greenRows[0]?.IsGreen || 0; // fallback to 0 if not found

    // Save refresh token in cookie (optional Redis storage)
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken, isGreen: isGreen });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  } finally {
    connection.release();
  }
};


/**
 * @desc Refresh access token
 * @route POST /api/refresh
 */
export const refresh = asyncWrapper(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  // ✅ throw — not res.sendStatus()
  if (!oldRefreshToken) {
    throw new UnauthorizedError("No refresh token provided.");
  }

  // ── Verify JWT signature ──
  let payload;
  try {
    payload = jwt.verify(oldRefreshToken, REFRESH_SECRET);
  } catch (err) {
    throw new ForbiddenError("Refresh token is invalid or expired.");
  }

  // ── Check Redis ──
  const stored = await redisClient.get(payload.id.toString());

  if (!stored) {
    // ✅ Migration fix — logged in before Redis was wired
    // JWT already verified above — safe to issue new tokens
    console.warn(`⚠️ Migrating old session for user ${payload.id}`);
    // fall through — don't throw
  }

  if (stored && stored !== oldRefreshToken) {
    // ✅ Token reuse — possible theft — kill all sessions
    await redisClient.del(payload.id.toString());
    console.error(`🚨 Token reuse detected for user ${payload.id}`);
    throw new ForbiddenError("Token reuse detected. Please login again.");
  }

  // ── Issue new token pair ──
  // ✅ Fixed payload — userName not email (matches verifyToken)
  const accessToken = jwt.sign(
    { id: payload.id, userName: payload.userName },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const newRefreshToken = jwt.sign(
    { id: payload.id, userName: payload.userName },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // ── Store new token in Redis ──
  await redisClient.setEx(
    payload.id.toString(),
    7 * 24 * 60 * 60,   // 7 days in seconds
    newRefreshToken
  );

  // ── Rotate cookie ──
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure  : process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge  : 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ status: "success", accessToken });
});

/**
 * @desc Logout user
 * @route POST /auth/logout
 */
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204); // nothing to do

    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch {
      payload = null;
    }

    if (payload?.id && process.env.USE_REDIS === "true") {
      // Delete refresh token from Redis only if enabled
      await redisClient.del(payload.id.toString());
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    res.sendStatus(204); // success
  } catch (err) {
    console.error("Logout failed:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};


/**
 * @desc Protected user profile
 * @route GET /api/profile
 */
export const profile = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch {
    res.sendStatus(403);
  }
};

/**
 * @desc Forgot Password
 * @route POST /auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { email } = req.body;
    const [users] = await connection.query(
      "SELECT * FROM user_registration_basic WHERE emailID = ?",
      [email]
    );
    if (users.length === 0)
      return res.status(400).json({ message: "Couldn't find your Account" });

    // get password
    const user = users[0];

    // 2️⃣ Find login credentials
    const [logins] = await connection.query(
      "SELECT * FROM user_login WHERE UserID = ?",
      [user.RegistrationID]
    );
    const login = logins[0];
    const passwordToSend = login.UserPassword;
    const userName = login.UserName;
    const firstName = user["First Name"]; // from user_registration_basic

    // Use your email template function
    const { html, text } = forgotPasswordEmailTemplate(userName, passwordToSend, firstName);

    await sendEmail(email, "Forgot Password", { html, text });

    res.json({
      message: "Your password has been sent to your email.",
    });

    // const user = users[0];
    // const token = randomBytes(32).toString("hex");
    // const expiry = new Date(Date.now() + 3600000); // 1 hr

    // await connection.query(
    //   "UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?",
    //   [token, expiry, user.id]
    // );

    // const resetUrl = `http://localhost:5173/reset-password/${token}`;
    // await sendEmail(email, "Reset Password", `Reset here: ${resetUrl}`);

    // res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  } finally {
    connection.release();
  }
};

/**
 * @desc Reset Password
 * @route POST /auth/reset-password/:token
 * @access Public
 */
export const resetPassword = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { token } = req.params;
    const { password } = req.body;

    const [users] = await connection.query(
      "SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > NOW()",
      [token]
    );

    if (users.length === 0)
      return res.status(400).json({ message: "Invalid or expired token" });

    const user = users[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      "UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

/**
 * Compare plain text passwords
 * @param {string} inputPassword - Password entered by user
 * @param {string} storedPassword - Password from database
 * @returns {boolean} - true if match
 */
const comparePlainPasswords = (inputPassword, storedPassword) => {
  if (!storedPassword) return false;
  return inputPassword === storedPassword;
};

export default comparePlainPasswords;

/**
 * @desc Verify if Sponsor ID exists
 * @route GET /auth/verify-sponsor/:id
 * @access Public
 */
export const verifySponsor = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    if (!id || id.length !== 8) {
      return res.status(400).json({ message: "Invalid Sponsor ID format" });
    }

    //   const [loginRows] = await connection.query(
    //     `SELECT RegistrationID, IsGreen
    //  FROM user_login 
    //  WHERE UserName = ?`,
    //     [id]
    //   );

    // if (loginRows.length === 0) {
    //   return res.status(404).json({ message: "Sponsor not found" });
    // }

    // 
    // const isGreen = loginRows[0].IsGreen;
    // Step 1: Get RegistrationID from user_login
    const [loginRows] = await connection.query(
      `SELECT RegistrationID
   FROM user_login
   WHERE UserName = ?`,
      [id]
    );
    const registrationID = loginRows[0]?.RegistrationID;
    
    // Step 2: Get IsGreen from Green_User_List
    const [greenRows] = await connection.query(
      `SELECT IsGreen
   FROM Green_User_List
   WHERE UserName = ?`,
      [id]
    );
    const isGreen = greenRows[0]?.IsGreen || 0; // fallback to 0 if not found


    const [userRows] = await connection.query(
      `SELECT \`First Name\`, \`Last Name\`
   FROM user_registration_basic
   WHERE RegistrationID = ?`,
      [registrationID]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "Sponsor details not found" });
    }

    const sponsor = userRows[0];
    const fullName = [sponsor["First Name"], sponsor["Last Name"]].filter(Boolean).join(" ");

    // res.json({ name: fullName });
    res.json({
      name: fullName,
      isGreen: isGreen  // ✅ send IsGreen to frontend
    });

  } catch (err) {
    console.error("Verify sponsor error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    connection.release();
  }
};

