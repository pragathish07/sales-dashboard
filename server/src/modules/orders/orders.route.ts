import { Router } from "express";
import { getOrders, createOrder, updateStatus, getOrdersBySalesUser } from "./orders.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getOrders);
router.post("/", verifyToken, createOrder);
router.patch("/:id/status", verifyToken, updateStatus);
router.get("/sales", verifyToken, getOrdersBySalesUser);

export default router;
