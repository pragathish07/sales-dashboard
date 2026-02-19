import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./products.controller";
// import { authenticate } from "../../middleware/auth.middleware";
// import { authorize } from "../../middleware/role.middleware";
 
// const router = Router();
 
// router.post("/", authenticate, authorize(["ADMIN"]), createProduct);
// router.get("/", authenticate, getProducts);
// router.get("/:id", authenticate, getProductById);
// router.put("/:id", authenticate, authorize(["ADMIN"]), updateProduct);
// router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteProduct);
 
// export default router;