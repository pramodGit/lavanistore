import { Router } from "express";
import { getProductsController, getProductByIdController, getGSTRatesController } from "../controllers/productController.js";

const router = Router();

// GET all products
router.get("/", getProductsController);

// GET a single product by query param ?pid=1
router.get("/:pid", getProductByIdController);

// POST /api/products/gst-rates
router.post("/gst-rates", getGSTRatesController);

export default router;
