/* // src/config/db.ts
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

console.log("[DEBUG] DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();



export default prisma;
 */