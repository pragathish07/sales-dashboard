import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.controller";
import { verifyToken, authorize } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", verifyToken, authorize(["ADMIN"]), createCategory);
router.get("/", verifyToken, getCategories);
router.get("/:id", verifyToken, getCategoryById);
router.put("/:id", verifyToken, authorize(["ADMIN"]), updateCategory);
router.delete("/:id", verifyToken, authorize(["ADMIN"]), deleteCategory);

export default router;
