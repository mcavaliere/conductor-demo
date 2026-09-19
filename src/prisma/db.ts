import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

// Module-level singleton. In Next.js dev, module reloads on every change would
// otherwise construct a new pool each time; cache it on globalThis so we reuse
// one pool for the process lifetime. Never call db.close() in the request loop.
const globalForDb = globalThis as unknown as { db?: ReturnType<typeof postgres<Contract>> };

export const db =
  globalForDb.db ??
  postgres<Contract>({
    contractJson,
    url: process.env['DATABASE_URL']!,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
