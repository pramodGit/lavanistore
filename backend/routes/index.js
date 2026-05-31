import { Router } from "express";
import { userReportsController, userRewardController } from "../controllers/report.js";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import orderRoutes from "./orderRoutes.js";
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router();

// --- PUBLIC ROUTES (No middleware here) ---

// Product APIs
router.use("/products", productRoutes);
// Category APIs
router.use("/categories", categoryRoutes);


// --- PROTECTED ROUTES (Middleware applied below) ---

// Apply verifyToken to all routes defined after this line
router.use(verifyToken);

// Reports APIs
router.post("/user-level-report", userReportsController);
router.post("/user-reward-report", userRewardController);

// User APIs
router.use("/users", userRoutes); 

// Order APIs
router.use("/orders", orderRoutes);

export default router;