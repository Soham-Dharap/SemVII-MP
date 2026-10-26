import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient(): PrismaClient {
  const client = new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

/**
 * Lazy Prisma client. The proxy only constructs the client the first time a
 * model is accessed, so importing this module never opens a database
 * connection (and never throws during build-time page collection).
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = globalForPrisma.prisma ?? createClient();
    const value = Reflect.get(client, property);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
