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
  static async createGame(data: GameData, playerId: string): Promise<number> {
    const [created] = await db
      .insert(gamesTable)
      .values({
        gold: data.gold,
        metal: data.metal,
        fuel: data.fuel,
        level: data.level,
        lastOnline: data.lastOnline,
        lastTimeBaseSpawned: data.lastTimeBaseSpawned,
        unlockedUnits: data.unlockedUnits,
        ownedUnits: data.ownedUnits,
        playerId: playerId,
      })
      .returning({ id: gamesTable.id });

    const newGameId = created.id;

    // Agora que você tem o ID certo, pode criar as unidades
    if (data.units && data.units.length > 0) {
      for (const unit of data.units) {
        await db.insert(unitsTable).values({
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
          gameId: newGameId,
        });
      }
    }

    return newGameId;
  }

  static async updateGame(data: GameData): Promise<void> {
    // Atualiza o jogo
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

    // Atualiza as unidades
    if (data.units && data.units.length > 0) {
      // Remove todas as unidades anteriores
      await db.delete(unitsTable).where(eq(unitsTable.gameId, data.id));

      // Insere as unidades novas
      for (const unit of data.units) {
        await db.insert(unitsTable).values({
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
