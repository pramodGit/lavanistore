import express from "express";

const router = express.Router();

// Controller
import { register, login, refresh, logout, forgotPassword, resetPassword, verifySponsor, profile } from "../controllers/authController.js";


// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
// Verify Sponsor ID
router.get("/verify-sponsor/:id", verifySponsor);

// protected route
router.get("/profile", profile);

export default router;