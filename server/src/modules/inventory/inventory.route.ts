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


router.get('/', verifyToken, getAllInventory);

router.get('/alerts/low-stock', verifyToken, getLowStockAlerts);

router.get('/:productId', verifyToken, getInventoryByProductId);

router.post('/', verifyToken, requireRole(['ADMIN']), createInventory);

router.put('/:productId', verifyToken, requireRole(['ADMIN']), updateInventory);

router.patch('/:productId/adjust', verifyToken, requireRole(['ADMIN']), adjustInventoryQuantity);

router.delete('/:productId', verifyToken, requireRole(['ADMIN']), deleteInventory);

export default router;