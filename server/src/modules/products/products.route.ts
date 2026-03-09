import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./products.controller";
import { verifyToken, authorize } from "../../middleware/auth.middleware";

 
const router = Router();
 
router.post("/", verifyToken, authorize(["ADMIN"]), createProduct);
router.get("/", verifyToken, getProducts);
router.get("/:id", verifyToken, getProductById);
router.put("/:id", verifyToken, authorize(["ADMIN"]), updateProduct);
router.delete("/:id", verifyToken, authorize(["ADMIN"]), deleteProduct);
 
export default router;