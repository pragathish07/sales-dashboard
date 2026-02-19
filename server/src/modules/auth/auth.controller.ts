import { Request, Response } from "express";
import * as authService from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = await authService.loginUser(req.body);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const me = async (req: any, res: Response) => {
  const user = await authService.getCurrentUser(
    req.user.id
  );

  res.json(user);
};
