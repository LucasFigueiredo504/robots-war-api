import { eq } from "drizzle-orm";
import { db } from "../../db";
import { unitsTable } from "../../db/schema";
import { GameData, GameRepository } from "../infra/game-repository";

export async function saveGameUseCase(data: GameData) {
  try {
    await GameRepository.saveGame(data);

    return { status: 200, message: "success" };
  } catch (error) {
    return { status: 500, message: "error" };
  }
}
