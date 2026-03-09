// src/modules/inventory/inventory.controller.ts

import { Request, Response } from "express";
import * as inventoryService from "./inventory.service";

export const createInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await inventoryService.createInventory(req.body);
    res.status(201).json(inventory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await inventoryService.getAllInventory();
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventoryById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const inventory = await inventoryService.getInventoryById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventoryByProductId = async (req: Request<{ productId: string }>, res: Response) => {
  try {
    const inventory = await inventoryService.getInventoryByProductId(req.params.productId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found for this product" });
    }
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventory = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const inventory = await inventoryService.updateInventory(req.params.id, req.body);
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const adjustQuantity = async (req: Request<{ productId: string }>, res: Response) => {
  try {
    const inventory = await inventoryService.adjustInventoryQuantity(
      req.params.productId,
      req.body.adjustment
    );
    res.json(inventory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInventory = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await inventoryService.deleteInventory(req.params.id);
    res.json({ message: "Inventory deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const lowStockItems = await inventoryService.getLowStockItems();
    res.json(lowStockItems);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};