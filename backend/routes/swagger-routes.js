import { Router } from "express";
import { userReportsController, userRewardController } from "../controllers/report.js";

const router = Router();

// Reports APIs
router.post("/user-level-report", userReportsController);
router.post("/user-reward-report", userRewardController);

// Dashboard Overview
router.get("/dashboard/overview", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({
    totalProperties: 124,
    availableProperties: 98,
    soldProperties: 26,
    totalUsers: 340,
    totalRevenue: 5200000
  });
});

// Users
router.get("/dashboard/users", (req, res) => {
  res.json({
    users: [
      { id: "u101", name: "Alice", email: "alice@example.com", role: "buyer" },
      { id: "u102", name: "Bob", email: "bob@example.com", role: "agent" }
    ],
    pagination: { page: 1, limit: 10, total: 340 }
  });
});

router.patch("/dashboard/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({ id, name: "Bob", email: "bob@example.com", role: req.body.role });
});

// Properties Summary
router.get("/dashboard/properties/summary", (req, res) => {
  res.json({
    byLocation: [
      { location: "New York", count: 45 },
      { location: "Miami", count: 20 }
    ],
    byStatus: [
      { status: "available", count: 98 },
      { status: "sold", count: 26 }
    ]
  });
});

// Top Properties
router.get("/dashboard/properties/top", (req, res) => {
  res.json([
    { id: "123456", title: "Luxury Apartment", views: 450 },
    { id: "789012", title: "Beachside Villa", views: 370 }
  ]);
});

// Revenue
router.get("/dashboard/revenue", (req, res) => {
  res.json({
    range: "monthly",
    data: [
      { month: "Jan", revenue: 150000 },
      { month: "Feb", revenue: 120000 },
      { month: "Mar", revenue: 200000 }
    ],
    total: 470000
  });
});

// Transactions
router.get("/dashboard/transactions", (req, res) => {
  res.json([
    {
      id: "t001",
      propertyId: "123456",
      buyer: "Alice",
      amount: 500000,
      date: "2025-08-01"
    },
    {
      id: "t002",
      propertyId: "789012",
      buyer: "Bob",
      amount: 800000,
      date: "2025-08-05"
    }
  ]);
});

export default router;