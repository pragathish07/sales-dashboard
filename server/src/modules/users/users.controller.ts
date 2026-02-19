import { Request, Response } from "express";
import * as usersService from "./users.service";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await usersService.fetchAllUsers();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await usersService.createUser(req.body);

    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error,
    });
  }
};
