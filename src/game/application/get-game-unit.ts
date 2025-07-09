import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { gamesTable, unitsTable } from "../../db/schema";
import { GameRepository } from "../infra/game-repository";

export async function getGameUnit(unitId: number, gameId: number) {
  try {
    const unit = await GameRepository.getGameUnityById(unitId, gameId);

    if (!unit) {
      return { status: 404, message: "error" };
    }

    return { status: 500, message: "success", data: unit };
  } catch (error) {
    return { status: 500, message: "error" };
  }
}
