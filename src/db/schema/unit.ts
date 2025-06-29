import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";
import { gamesTable } from "./game";

export const unitsTable = pgTable("units", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pos_x: numeric().notNull(),
  pos_y: numeric().notNull(),
  level: numeric().notNull(),
  current_hp: numeric().notNull(),
  type: varchar().notNull(),
  resource_amount: numeric().notNull(),
  available: boolean().default(true),
  game_id: varchar().notNull(),
});

export const unitsRelation = relations(unitsTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [unitsTable.game_id],
    references: [gamesTable.id],
  }),
}));
