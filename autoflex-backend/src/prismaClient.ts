import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables. Call once at app entry if preferred.
dotenv.config();

// Example: pass a direct DB connection via `adapter` or use `accelerateUrl` for Prisma Accelerate.
// Make sure you have the matching env variables in your .env file.

const dbUrl = process.env.DATABASE_URL;
const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;

// Use `adapter` for a direct database connection
const clientOptions: any = {};
if (dbUrl) {
  clientOptions.adapter = { url: dbUrl };
}

// Or use Prisma Accelerate
if (accelerateUrl) {
  clientOptions.accelerateUrl = accelerateUrl;
}

export const prisma = new PrismaClient(clientOptions);

export default prisma;
