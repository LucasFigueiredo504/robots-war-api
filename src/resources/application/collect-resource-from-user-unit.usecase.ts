import { getGameUnit } from "../../game/application/get-game-unit";
import { GameRepository } from "../../game/infra/game-repository";
import { ResourcesRepository } from "../infra/resources.repository";

export async function collectResourceFromUserUnit(
  gameId: number,
  collectorId: number
) {
  try {
    const unit = await GameRepository.getGameUnityById(collectorId, gameId);
    if (!unit) {
      return { status: 404, message: "not found" };
    }
    const game = await GameRepository.getGame(gameId);
    if (!game) {
      return { status: 404, message: "game not found" };
    }

    switch (collectorId) {
      case 1:
        await ResourcesRepository.updateGoldAmount(200, collectorId);
        break;
      case 2:
        await ResourcesRepository.updateFuelAmount(200, collectorId);
      default:
        await ResourcesRepository.updateMetaldAmount(200, collectorId);
        break;
    }

    return { status: 200, message: "success" };
  } catch (error) {
    console.log("Error when collecting resource", error);
  }
}
