import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Module-level singleton. In Next.js dev, module reloads on every change would
// otherwise construct a new pool each time; cache it on globalThis so we reuse
// one pool for the process lifetime. Never call db.$disconnect() in the request loop.
const globalForDb = globalThis as unknown as { db?: PrismaClient };

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });

export const db = globalForDb.db ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
