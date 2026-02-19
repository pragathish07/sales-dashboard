import { Request, Response } from 'express';
import { OrderService } from './orders.service';
import { CreateOrderRequest, GetOrdersFilter, ApiResponse } from './orders.types';

const orderService = new OrderService();

export class OrderController {
  // Create new order
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CreateOrderRequest = req.body;

      // Basic validation
      if (!orderData.customerId || !orderData.userId || !orderData.items || orderData.items.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: customerId, userId, items'
        } as ApiResponse<null>);
        return;
      }

      const order = await orderService.createOrder(orderData);
      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully'
      } as ApiResponse<any>);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create order'
      } as ApiResponse<null>);
    }
  }

  // Get all orders with filters
  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const filters: GetOrdersFilter = {
        status: req.query.status as string,
        customerId: req.query.customerId as string,
        userId: req.query.userId as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        sortBy: (req.query.sortBy as 'createdAt' | 'totalAmount') || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await orderService.getAllOrders(filters);
      res.status(200).json({
        success: true,
        data: result.orders,
        message: `Retrieved ${result.orders.length} orders`,
        total: result.total
      } as any);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch orders'
      } as ApiResponse<null>);
    }
  }

  // Get single order
  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Order ID is required'
        } as ApiResponse<null>);
        return;
      }

      const order = await orderService.getOrderById(id);
      res.status(200).json({
        success: true,
        data: order
      } as ApiResponse<any>);
    } catch (error: any) {
      if (error.message === 'Order not found') {
        res.status(404).json({
          success: false,
          error: 'Order not found'
        } as ApiResponse<null>);
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to fetch order'
        } as ApiResponse<null>);
      }
    }
  }

  // Get order statistics
  async getOrderStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await orderService.getOrderStatistics();
      res.status(200).json({
        success: true,
        data: statistics,
        message: 'Order statistics retrieved successfully'
      } as ApiResponse<any>);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch statistics'
      } as ApiResponse<null>);
    }
  }
}
