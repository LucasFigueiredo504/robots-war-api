import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { gamesTable, unitsTable } from "../../db/schema";

export type UnitRecord = {
  id: number;
  pos_x: string;
  pos_y: string;
  level: string;
  current_hp: string;
  current_level: string;
  type: string;
  resource_amount: string;
  isReady: boolean | null;
  available: boolean | null;
  game_id: number;
};
export type GameData = {
  id: number;
  gold?: string | null;
  metal?: string | null;
  fuel?: string | null;
  level?: string | null;
  lastOnline?: Date | null;
  lastTimeBaseSpawned?: Date | null;
  unlockedUnits?: string[] | null;
  ownedUnits?: number[] | null;
  player_id: string;
};

export class GameRepository {
  static async getGameUnityById(
    unitId: number,
    gameId: number
  ): Promise<UnitRecord | null> {
    const game = await db
      .select({
        id: gamesTable.id,
        ownedUnits: gamesTable.ownedUnits,
      })
      .from(gamesTable)
      .where(eq(gamesTable.id, gameId))
      .then((res) => res[0]);

    if (!game) {
      throw new Error("Game not found");
    }

    const unit = await db
      .select()
      .from(unitsTable)
      .where(
        and(
          eq(unitsTable.id, unitId),
          inArray(unitsTable.id, game.ownedUnits ?? []),
          eq(unitsTable.game_id, gameId)
        )
      );

    if (!unit || unit.length === 0) {
      throw new Error("Unit not found");
    }

    return unit[0];
  }
  static async saveGame(data: GameData): Promise<void> {
    await db
      .update(gamesTable)
      .set({
        gold: data.gold,
        metal: data.metal,
        fuel: data.fuel,
        level: data.level,
        lastOnline: data.lastOnline,
        lastTimeBaseSpawned: data.lastTimeBaseSpawned,
        unlockedUnits: data.unlockedUnits,
        ownedUnits: data.ownedUnits,
      })
      .where(eq(gamesTable.id, data.id));
  }
  static async getGame(gameId: number): Promise<GameData | null> {
    const result = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, gameId));

    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  }
}
