import { Router } from "express";
import { adminStats, salesStats } from "./reports.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.get("/admin-stats", verifyToken, requireRole(["ADMIN"]), adminStats);
router.get("/sales-stats", verifyToken, salesStats);

export default router;
