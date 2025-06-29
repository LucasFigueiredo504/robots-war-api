import { relations } from "drizzle-orm";
import { integer, numeric, pgTable, varchar } from "drizzle-orm/pg-core";
import { playersTable } from "./player";

export const gamesTable = pgTable("games", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  gold: numeric().default("0"),
  metal: numeric().default("0"),
  fuel: numeric().default("0"),
  level: numeric().default("0"),
  player_id: varchar().notNull().unique(),
});

export const gamesRelations = relations(gamesTable, ({ one }) => ({
  player: one(playersTable, {
    fields: [gamesTable.player_id],
    references: [playersTable.id],
  }),
}));
