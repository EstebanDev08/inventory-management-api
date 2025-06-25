import { relations, sql } from 'drizzle-orm';
import { datetime, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

import { UserRole } from '#src/modules/user/domain/entities/user.entity';

import { customDrizzleUuid } from '../custom/uuid.field';

import { userRole } from './user_role';

export const role = mysqlTable('role', {
  id: customDrizzleUuid('id').notNull().primaryKey(),
  name: mysqlEnum(Object.values(UserRole) as [string, ...string[]])
    .notNull()
    .$type<UserRole>(),
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
