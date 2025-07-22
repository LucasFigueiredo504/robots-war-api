import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { playersTable } from "./player";

export const gamesTable = pgTable("games", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  gold: numeric("gold").default("0"),
  metal: numeric("metal").default("0"),
  fuel: numeric("fuel").default("0"),
  level: numeric("level").default("0"),
  lastOnline: timestamp("last_online").defaultNow(),
  lastTimeBaseSpawned: timestamp("last_time_base_spawned").defaultNow(),
  unlockedUnits: numeric("unlocked_units").array().default([]),
  partsCollected: numeric("parts_collected").array().default([]),
  ownedUnits: integer("owned_units").array().default([]),
  playerId: varchar("player_id").notNull().unique(),
});

export const gamesRelations = relations(gamesTable, ({ one }) => ({
  player: one(playersTable, {
    fields: [gamesTable.playerId],
    references: [playersTable.id],
  }),
}));
