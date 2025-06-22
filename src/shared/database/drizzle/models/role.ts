import { relations, sql } from 'drizzle-orm';
import { datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

import { userRole } from './user_role';

export const role = mysqlTable('role', {
  id: varchar({ length: 36 }).notNull().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  created_at: datetime('created_at', { mode: 'date', fsp: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(6)`),
  updated_at: datetime('updated_at', { mode: 'date', fsp: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`),
});

export const roleRelations = relations(role, ({ many }) => ({
  users: many(userRole),
}));
