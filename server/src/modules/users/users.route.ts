// src/modules/users/users.routes.ts

import { Router } from "express";
import { createUser, getAllUsers } from "./users.controller";
// import { authenticateToken } from "./users.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";


const router = Router();

// only admins can list and create users
router.get("/", authenticate, requireRole(["ADMIN"]), getAllUsers);
router.post("/", authenticate, requireRole(["ADMIN"]), createUser as any);

export default router;
