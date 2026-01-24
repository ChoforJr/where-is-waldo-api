// This file creates and exports a single, reusable Prisma Client instance
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

export default prisma;
