// src/modules/users/users.routes.ts

import { Router } from "express";
import { createUser, getAllUsers } from "./users.controller";

const router = Router();

// GET /api/users
router.get("/", getAllUsers);
router.post("/", createUser);

export default router;
