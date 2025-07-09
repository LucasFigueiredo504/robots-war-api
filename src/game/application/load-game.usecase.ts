import { GameRepository } from "../infra/game-repository";

const collectorTypes = [1, 2, 3];

export async function loadGameUseCase(playerId: string) {
  try {
    const game = await GameRepository.getGameByPlayerId(playerId);
    if (!game) {
      return { status: 404, message: "not found" };
    }

    const units = await GameRepository.getGameUnitsyByGameId(game.id);
    if (!units || units.length === 0) {
      return { status: 404, message: "not found" };
    }

    const dateNow = new Date();

    const updatedUnits = await Promise.all(
      units
        .filter((unit) => collectorTypes.includes(Number(unit.typeId)))
        .map(async (unit) => {
          const lastDate = unit.lastTimeCollected
            ? new Date(unit.lastTimeCollected)
            : dateNow;

          const secondsElapsed =
            (dateNow.getTime() - lastDate.getTime()) / 1000;
          const accumulationRate = 1;
          const accumulatedAmount =
            secondsElapsed * accumulationRate * Number(unit.level);
          const newResourceAmount =
            accumulatedAmount + Number(unit.resourceAmount);

          await GameRepository.updateUnitResourcesAmount(
            unit.id,
            newResourceAmount
          );

          return {
            ...unit,
            resourceAmount: newResourceAmount,
            lastTimeCollected: dateNow.toISOString(),
          };
        })
    );

    return {
      status: 200,
      message: "success",
      game,
      updatedUnits,
    };
  } catch (error) {
    return { status: 500, message: "error" };
  }
}
