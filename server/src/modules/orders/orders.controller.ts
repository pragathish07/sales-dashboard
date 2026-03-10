import e, { Request, Response } from "express";
import * as ordersService from "./orders.service";

export const getOrders = async (req: any, res: Response) => {
  try {
    let orders;
    if (req.user.role === "ADMIN") {
      orders = await ordersService.getAllOrders();
    } else {
      orders = await ordersService.getOrdersByUser(req.user.id);
    }
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

export const createOrder = async (req: any, res: Response) => {
  try {
    const order = await ordersService.createOrder({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json({ order });
  } catch (error: any) {
    res.status(400).json({ message: "Error creating order", error: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;
    const order = await ordersService.updateOrderStatus(orderId, status);
    res.json({ order });
  } catch (error: any) {
    res.status(400).json({ message: "Error updating order", error: error.message });
  }
};


export const getOrdersBySalesUser = async (req: Request, res: Response) => {
  try {
    
    const orders = await ordersService.getOrdersWithSalesUser();
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }

}