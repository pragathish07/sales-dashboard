import { Request, Response } from "express";
import * as productService from "./products.service";


export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
};
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getProductsService();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};
export const getProductById = async (req: Request<{id : string}>, res: Response) => {
  try {
    const product = await productService.getProductByIdService(req.params.id);
 
    if (!product)
      return res.status(404).json({ message: "Product not found" });
 
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};
export const updateProduct = async (req: Request<{id : string}>, res: Response) => {
  try {
    const product = await productService.updateProductService(
      req.params.id,
      req.body
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};
export const deleteProduct = async (req: Request<{id : string}>, res: Response) => {
  try {
    await productService.deleteProductService(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};