import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { gamesTable } from "./game";

export const unitsTable = pgTable("units", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  posX: numeric("pos_x", { precision: 10, scale: 4 }).notNull(),
  posY: numeric("pos_y", { precision: 10, scale: 4 }).notNull(),
  level: numeric("level").notNull(),
  currentHp: numeric("current_hp").notNull(),
  currentLevel: numeric("current_level").notNull(),
  typeId: integer("type_id").notNull(),
  instanceId: varchar("instance_id").notNull(),
  resourceAmount: numeric("resource_amount").notNull(),
  lastTimeCollected: timestamp("last_time_collected").defaultNow(),
  isReady: boolean("is_ready").default(true),
  available: boolean("available").default(true),
  gameId: integer("game_id").notNull(),
});

export const unitsRelation = relations(unitsTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [unitsTable.gameId],
    references: [gamesTable.id],
  }),
}));
