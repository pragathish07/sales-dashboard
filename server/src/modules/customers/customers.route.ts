import { Router } from "express";
import { getCustomers, createCustomer } from "./customers.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getCustomers);
router.post("/", verifyToken, createCustomer);

export default router;
