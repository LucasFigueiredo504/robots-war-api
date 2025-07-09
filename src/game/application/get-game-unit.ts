import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { gamesTable, unitsTable } from "../../db/schema";

export async function getGameUnit(unitId: number, gameId: number) {
  try {
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
      return { message: "error" };
    }

    return { message: "success", data: unit };
  } catch (error) {
    return { message: "error" };
  }
}
