// src/modules/users/users.routes.ts

import { Router } from "express";
import { createUser, getAllUsers } from "./users.controller";
//import { authenticateToken } from "./users.middleware";
import { verifyToken } from "../../middleware/auth.middleware";


const router = Router();

router.get("/", verifyToken, getAllUsers);
router.post("/", createUser);

export default router;
