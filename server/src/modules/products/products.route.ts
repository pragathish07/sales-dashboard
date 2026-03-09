import { Router } from "express";
import {
  getProducts,
  createProduct,
  getCategories,
  createCategory,
} from "./products.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.get("/", verifyToken, getProducts);
router.post("/", verifyToken, requireRole(["ADMIN"]), createProduct);
router.get("/categories", verifyToken, getCategories);
router.post("/categories", verifyToken, requireRole(["ADMIN"]), createCategory);

export default router;
