import { Request, Response } from "express";
import * as productsService from "./products.service";

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productsService.getAllProducts();
    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json({ product });
  } catch (error: any) {
    res.status(400).json({ message: "Error creating product", error: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await productsService.getAllCategories();
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await productsService.createCategory(req.body.name);
    res.status(201).json({ category });
  } catch (error: any) {
    res.status(400).json({ message: "Error creating category", error: error.message });
  }
};
