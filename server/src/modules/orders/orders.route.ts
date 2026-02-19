import { Router, Request, Response } from 'express';
import { OrderController } from './orders.controller';

const router = Router();
const orderController = new OrderController();

// Create new order
// POST /orders
// Body: { customerId, userId, items: [{ productId, quantity }], paymentMethod }
router.post('/', (req: Request, res: Response) => orderController.createOrder(req, res));

// Get all orders with pagination and filters
// GET /orders?status=COMPLETED&customerId=xxx&userId=xxx&startDate=xxx&endDate=xxx&limit=10&offset=0&sortBy=createdAt&sortOrder=desc
router.get('/', (req: Request, res: Response) => orderController.getAllOrders(req, res));

// Get order statistics
// GET /orders/stats/dashboard
router.get('/stats/dashboard', (req: Request, res: Response) => orderController.getOrderStatistics(req, res));

// Get single order by ID
// GET /orders/:id
router.get('/:id', (req: Request, res: Response) => orderController.getOrderById(req, res));

export default router;
