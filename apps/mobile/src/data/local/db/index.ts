import { drizzle } from 'drizzle-orm/op-sqlite';
import { open } from '@op-engineering/op-sqlite';

import * as schema from './schema';

import { createTables } from './table';

const sqlite = open({ name: 'eatWell.db' });

export const db = drizzle(sqlite, { schema });

export async function initDatabase() {
  await createTables(sqlite);
}

export * from './schema';
