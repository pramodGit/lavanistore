import { Router } from "express";
import { getTeamByUsername, getOrderDetails } from "../controllers/userController.js";

const router = Router();

// Must define specific routes before dynamic ones

// Route for order details
router.get("/:username/order-history", getOrderDetails);

// Route to fetch user by username
router.get("/:username", getTeamByUsername);

export default router;
