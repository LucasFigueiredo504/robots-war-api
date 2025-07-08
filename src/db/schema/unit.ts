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
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pos_x: numeric("pos_x").notNull(),
  pos_y: numeric("pos_y").notNull(),
  level: numeric("level").notNull(),
  current_hp: numeric("current_hp").notNull(),
  current_level: numeric("current_level").notNull(),
  type: varchar("type").notNull(),
  resource_amount: numeric("resource_amount").notNull(),
  isReady: boolean("is_ready").default(true),
  available: boolean("available").default(true),
  game_id: varchar("game_id").notNull(),
});

export const unitsRelation = relations(unitsTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [unitsTable.game_id],
    references: [gamesTable.id],
  }),
}));
