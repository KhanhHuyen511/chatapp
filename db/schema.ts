import { sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users_table', {
  id: text().primaryKey(),
  name: text().notNull(),
});

export const messagesTable = sqliteTable('messages_table', {
  id: text().primaryKey(),
  content: text(),
  reaction: text(),
  attachments: text(), // Attachments will not be handled in the database
  createdAt: text()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdBy: text().notNull(),
});
