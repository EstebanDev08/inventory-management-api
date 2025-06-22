import { relations, sql } from 'drizzle-orm';
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

import { role } from './role';
import { user } from './user';

export const userRole = mysqlTable(
  'user_role',
  {
    user_id: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id),
    role_id: varchar('role_id', { length: 36 })
      .notNull()
      .references(() => role.id),
    assigned_at: timestamp('assigned_at').defaultNow().notNull(),
    created_at: datetime('created_at', { mode: 'date', fsp: 6 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(6)`),
    updated_at: datetime('updated_at', { mode: 'date', fsp: 6 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.role_id, table.user_id] }),
    rol_id: index('rol_id').on(table.role_id),
  }),
);

export const userRolesRelations = relations(userRole, ({ one }) => ({
  user: one(user, {
    fields: [userRole.user_id],
    references: [user.id],
  }),
  role: one(role, {
    fields: [userRole.role_id],
    references: [role.id],
  }),
}));
