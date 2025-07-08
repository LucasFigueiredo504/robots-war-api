import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { gamesTable } from "./game";

export const playersTable = pgTable("players", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password", { length: 255 }).notNull(),
});

export const playersRelations = relations(playersTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [playersTable.id],
    references: [gamesTable.player_id],
  }),
}));
