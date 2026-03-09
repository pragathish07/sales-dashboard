import { Router } from "express";
import { getOrders, createOrder, updateStatus } from "./orders.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getOrders);
router.post("/", verifyToken, createOrder);
router.patch("/:id/status", verifyToken, updateStatus);

export default router;
