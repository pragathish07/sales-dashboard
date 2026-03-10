import { Response } from "express";
import * as reportsService from "./reports.service";

export const adminStats = async (_req: any, res: Response) => {
  try {
    const stats = await reportsService.getAdminStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching admin stats", error: error.message });
  }
};

export const salesStats = async (req: any, res: Response) => {
  try {
    const stats = await reportsService.getSalesStats(req.user.id);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching sales stats", error: error.message });
  }
};
