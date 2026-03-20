import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_PRISMA_URL!,
});

export const prisma = new PrismaClient({ adapter });
