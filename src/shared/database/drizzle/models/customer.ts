import { relations, sql } from 'drizzle-orm';
import { datetime, mysqlTable, text } from 'drizzle-orm/mysql-core';

import { customDrizzleUuid } from '../custom/uuid.field';

import { user } from './user';

export const customer = mysqlTable('customer', {
  user_id: customDrizzleUuid('user_id')
    .notNull()
    .references(() => user.id),
  shipping_address: text('shipping_address').notNull(),
  created_at: datetime('created_at', { mode: 'date', fsp: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(6)`),
  updated_at: datetime('updated_at', { mode: 'date', fsp: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`),
});

export const customerRelations = relations(customer, ({ one }) => ({
  user: one(user, {
    fields: [customer.user_id],
    references: [user.id],
  }),
}));
