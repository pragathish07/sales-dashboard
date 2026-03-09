import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from './orders.controller'
import { verifyToken, authorize } from '../../middleware/auth.middleware'

const router = Router()

router.post('/', verifyToken, createOrder)
router.get('/', verifyToken, getOrders)
router.get('/:id', verifyToken, getOrderById)
router.put('/:id/status', verifyToken, authorize(['ADMIN']), updateOrderStatus)

export default router