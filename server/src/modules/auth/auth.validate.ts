// src/modules/auth/auth.validation.ts

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "SALES"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
