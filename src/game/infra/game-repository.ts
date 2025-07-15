import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { gamesTable, unitsTable } from "../../db/schema";

export type UnitRecord = {
  id?: number;
  posX: string;
  posY: string;
  level: string;
  currentHp: string;
  currentLevel: string;
  typeId: number;
  instanceId: string;
  resourceAmount: string;
  isReady: boolean | null;
  available: boolean | null;
  lastTimeCollected?: Date | null;
  gameId: number;
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
  playerId: string;
  units?: UnitRecord[];
};

export class GameRepository {
  static async getGameUnitsyByGameId(
    gameId: number
  ): Promise<UnitRecord[] | null> {
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
          inArray(unitsTable.id, game.ownedUnits ?? []),
          eq(unitsTable.gameId, gameId)
        )
      );

    if (!unit || unit.length === 0) {
      throw new Error("Unit not found");
    }

    return unit;
  }
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
          eq(unitsTable.gameId, gameId)
        )
      );

    if (!unit || unit.length === 0) {
      throw new Error("Unit not found");
    }

    return unit[0];
  }
  static async saveGame(data: GameData): Promise<void> {
    // Start a transaction to ensure both game and units are saved together
    await db.transaction(async (tx) => {
      // Update the game data
      await tx
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

      // If there are units to save
      if (data.units && data.units.length > 0) {
        // First, delete existing units for this game (optional, depends on your needs)
        await tx.delete(unitsTable).where(eq(unitsTable.gameId, data.id));

        // Then insert all the new units
        for (const unit of data.units) {
          await tx.insert(unitsTable).values({
            posX: unit.posX,
            posY: unit.posY,
            level: unit.level,
            currentHp: unit.currentHp,
            currentLevel: unit.currentLevel,
            typeId: unit.typeId,
            instanceId: unit.instanceId,
            resourceAmount: unit.resourceAmount,
            lastTimeCollected: unit.lastTimeCollected,
            isReady: unit.isReady,
            available: unit.available,
            gameId: data.id,
          });
        }
      }
    });
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
  static async getGameByPlayerId(playerId: string): Promise<GameData | null> {
    const result = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.playerId, playerId));

    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  }
  static async updateUnitResourcesAmount(
    unitId: number,
    amount: number
  ): Promise<void> {
    await db
      .update(unitsTable)
      .set({ resourceAmount: String(amount) })
      .where(eq(unitsTable.id, unitId));
  }
}
