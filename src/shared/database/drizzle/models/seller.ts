import { relations, sql } from 'drizzle-orm';
import { datetime, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

import { customDrizzleUuid } from '../custom/uuid.field';

import { user } from './user';

export const seller = mysqlTable('seller', {
  user_id: customDrizzleUuid('user_id')
    .notNull()
    .references(() => user.id),
  store_name: varchar('store_name', { length: 255 }).notNull(),
  store_description: text('description'),
  created_at: datetime('created_at', { mode: 'date', fsp: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(6)`),
  updated_at: datetime('updated_at', { mode: 'date', fsp: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`),
});

export const sellerRelations = relations(seller, ({ one }) => ({
  user: one(user, {
    fields: [seller.user_id],
    references: [user.id],
  }),
}));
