import { Request, Response } from "express";
import * as customersService from "./customers.service";

export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await customersService.getAllCustomers();
    res.json({ customers });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customersService.findOrCreateCustomer(req.body);
    res.status(201).json({ customer });
  } catch (error: any) {
    res.status(400).json({ message: "Error creating customer", error: error.message });
  }
};
