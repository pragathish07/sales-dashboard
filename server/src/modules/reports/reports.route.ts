import { Router } from 'express'
import {
  getSalesReport,
  getInventoryReport
} from './reports.controller'
import { verifyToken, authorize } from '../../middleware/auth.middleware'

const router = Router()

router.get('/sales', verifyToken, authorize(['ADMIN']), getSalesReport)
router.get('/inventory', verifyToken, authorize(['ADMIN']), getInventoryReport)

export default router