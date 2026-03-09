// src/modules/customers/customers.controller.ts

import { Request, Response } from "express";
import * as customersService from "./customers.service";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customersService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customersService.getAllCustomers();
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const customer = await customersService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const customer = await customersService.updateCustomer(req.params.id, req.body);
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await customersService.deleteCustomer(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};