import { Router } from "express";
import { placeOrderController, getOrderController } from "../controllers/orderController.js";

const router = Router();

// POST /api/orders → place a cart order or POS sale
router.post("/", placeOrderController);

// GET /api/orders/:id → fetch a single order
router.get("/:id", getOrderController);


export default router;
