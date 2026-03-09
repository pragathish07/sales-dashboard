// src/modules/customers/customers.route.ts

import { Router } from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "./customers.controller";

import { validate } from "../../middleware/validate";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customers.validation";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", verifyToken, validate(createCustomerSchema), createCustomer);
router.get("/", verifyToken, getAllCustomers);
router.get("/:id", verifyToken, getCustomerById);
router.put("/:id", verifyToken, validate(updateCustomerSchema), updateCustomer);
router.delete("/:id", verifyToken, deleteCustomer);

export default router;