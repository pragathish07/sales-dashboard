// src/modules/inventory/inventory.route.ts

import { Router } from "express";
import {
  createInventory,
  getAllInventory,
  getInventoryById,
  getInventoryByProductId,
  updateInventory,
  adjustQuantity,
  deleteInventory,
  getLowStockItems,
} from "./inventory.controller";

import { validate } from "../../middleware/validate";
import {
  createInventorySchema,
  updateInventorySchema,
  adjustQuantitySchema,
} from "./inventory.validation";

const router = Router();

router.post("/", validate(createInventorySchema), createInventory);
router.get("/", getAllInventory);
router.get("/low-stock", getLowStockItems);
router.get("/:id", getInventoryById);
router.get("/product/:productId", getInventoryByProductId);
router.put("/:id", validate(updateInventorySchema), updateInventory);
router.patch("/product/:productId/adjust", validate(adjustQuantitySchema), adjustQuantity);
router.delete("/:id", deleteInventory);

export default router;