import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Lazy init with fallback for build without generated client / no DATABASE_URL
function createPrismaClient() {
  try {
    return new PrismaClient()
  } catch (e) {
    // Fallback dummy client for build-time / dev without DB
    console.warn("Prisma client init failed, using dummy client for build:", e)
    return new Proxy({} as PrismaClient, {
      get: (_target, prop) => {
        // Return a dummy model handler that returns empty results
        return new Proxy(() => {}, {
          get: () => () => Promise.resolve(null),
          apply: () => Promise.resolve(null),
        }) as any
      },
    })
  }
}

export const db = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
