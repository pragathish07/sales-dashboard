import { Request, Response } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import * as orderService from './orders.service'

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await orderService.createOrderService(req.body, req.user!.id)
    res.status(201).json(order)
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create order' })
  }
}

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderService.getOrdersService()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderByIdService(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order' })
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await orderService.updateOrderStatusService(req.params.id, req.body.status)
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' })
  }
}