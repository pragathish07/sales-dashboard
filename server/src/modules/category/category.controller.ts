import { Request, Response } from "express";
import * as categoryService from "./category.service";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategoryService(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategoriesService();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

export const getCategoryById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const category = await categoryService.getCategoryByIdService(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category", error });
  }
};

export const updateCategory = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const category = await categoryService.updateCategoryService(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
};

export const deleteCategory = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await categoryService.deleteCategoryService(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};
