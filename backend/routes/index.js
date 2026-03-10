import { Router } from "express";
import { userReportsController, userRewardController } from "../controllers/report.js";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import orderRoutes from "./orderRoutes.js";

const router = Router();

// Reports APIs
router.post("/user-level-report", userReportsController);
router.post("/user-reward-report", userRewardController);

// User APIs
router.use("/users", userRoutes);

// Product APIs
router.use("/products", productRoutes);

// Category APIs
router.use("/categories", categoryRoutes); 

// Order APIs
router.use("/orders", orderRoutes);


export default router;