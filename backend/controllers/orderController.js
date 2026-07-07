// backend/controllers/orderController.js
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { placeOrder, getOrder } from "../services/orderService.js";

// ✅ Controller only handles req/res — zero business logic
export const placeOrderController = asyncWrapper(async (req, res) => {
  const { saleId } = await placeOrder(req.body);
  res.status(201).json({ message: "Order placed successfully", SaleID: saleId });
});

export const getOrderController = asyncWrapper(async (req, res) => {
  const isGreenOverride = typeof req.query?.isGreen !== "undefined"
    ? String(req.query.isGreen).toLowerCase() === "true"
    : undefined;

  const result = await getOrder(req.params.id, isGreenOverride);
  res.json(result);
});