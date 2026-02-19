// src/modules/auth/auth.routes.ts

import { Router } from "express";
import {
  register,
  login,
  me,
} from "./auth.controller";

import { validate } from "../../middleware/validate";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation";

import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", verifyToken, me);

export default router;
