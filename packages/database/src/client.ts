import { PrismaClient } from "./generated/client";
import * as adapterPg from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }

  const adapter = new adapterPg.PrismaPg({
    connectionString,
  });

  return new PrismaClient({ adapter });
}

export const db =
  globalForPrisma.prisma ??
  (process.env.SKIP_ENV_VALIDATION
    ? ({} as PrismaClient)
    : createPrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
