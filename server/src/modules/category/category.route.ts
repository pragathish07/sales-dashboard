import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// router.post("/", createCategory);
// router.get("/", getCategories);
// router.get("/:id", getCategoryById);
// router.put("/:id", updateCategory);
// router.delete("/:id", deleteCategory);
router.get("/", verifyToken, getCategories as any);
router.get("/:id", verifyToken, getCategoryById);
router.post("/", verifyToken, requireRole(["ADMIN"]), createCategory);
router.put("/:id", verifyToken, requireRole(["ADMIN"]), updateCategory);
router.delete("/:id", verifyToken, requireRole(["ADMIN"]), deleteCategory);

export default router;
