// src/modules/inventory/inventory.route.ts

import { Router } from 'express';
import {
  createInventory,
  getAllInventory,
  getInventoryByProductId,
  updateInventory,
  deleteInventory,
  adjustInventoryQuantity,
  getLowStockAlerts
} from './inventory.controller';
import { verifyToken } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

// All inventory routes require authentication
// GET operations are available to authenticated users
// POST/PUT/DELETE operations require ADMIN role

// Get all inventory items with optional filters
router.get('/', verifyToken, getAllInventory);

// Get low stock alerts (items below reorder level)
router.get('/alerts/low-stock', verifyToken, getLowStockAlerts);

// Get inventory by product ID
router.get('/:productId', verifyToken, getInventoryByProductId);

// Create new inventory record (ADMIN only)
router.post('/', verifyToken, requireRole(['ADMIN']), createInventory);

// Update inventory (ADMIN only)
router.put('/:productId', verifyToken, requireRole(['ADMIN']), updateInventory);

// Adjust inventory quantity (ADMIN only - for manual adjustments)
router.patch('/:productId/adjust', verifyToken, requireRole(['ADMIN']), adjustInventoryQuantity);

// Delete inventory record (ADMIN only)
router.delete('/:productId', verifyToken, requireRole(['ADMIN']), deleteInventory);

export default router;