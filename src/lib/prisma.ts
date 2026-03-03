import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createAdapter() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Parse DATABASE_URL: mysql://username:password@host:port/database
  const url = new URL(databaseUrl.replace(/^mysql:/, "http:"));
  const host = url.hostname;
  const port = parseInt(url.port) || 3306;
  const user = url.username;
  const password = url.password;
  const database = url.pathname.slice(1); // Remove leading '/'

  return new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 5,
  });
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: createAdapter(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
