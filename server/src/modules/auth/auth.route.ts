import { Router } from "express";
import {
  register,
  login,
  me,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  deleteUser,
  changePassword,
} from "./auth.controller";

import { validate } from "../../middleware/validate";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  userIdParamSchema,
} from "./auth.validate";

import { verifyToken } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

router.patch("/profile", verifyToken, validate(updateProfileSchema), updateProfile);
router.post("/change-password", verifyToken, validate(changePasswordSchema), changePassword);

router.delete(
  "/users/:userId",
  verifyToken,
  requireRole(["ADMIN"]),
  validate(userIdParamSchema),
  deleteUser
);

router.get("/me", verifyToken, me);

export default router;
