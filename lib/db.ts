import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Connection strings pasted from rendered docs/HTML often contain encoded
 * ampersands (`&amp;`, `&#x26;`, `&#38;`), which corrupt the query params
 * and make every Prisma query fail at runtime. Restore plain `&` before the
 * client ever sees the URL.
 */
function sanitizeDatabaseUrl(rawUrl: string | undefined): string | undefined {
  if (!rawUrl) return rawUrl;
  return rawUrl
    .replace(/&amp;/gi, "&")
    .replace(/&#x26;/gi, "&")
    .replace(/&#38;/gi, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .trim();
}

function createClient(): PrismaClient {
  const databaseUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);
  if (databaseUrl) {
    process.env.DATABASE_URL = databaseUrl;
  }
  const client = new PrismaClient(
    databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined,
  );
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
