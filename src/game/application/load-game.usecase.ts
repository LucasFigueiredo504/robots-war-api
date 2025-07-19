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

    const updatedUnitsMap = new Map<string, any>();

    // Use Promise.all to await all updates concurrently
    await Promise.all(
      // Added 'await' here to ensure all updates complete before continuing
      units
        .filter((unit) => collectorTypes.includes(Number(unit.typeId)))
        .map(async (unit) => {
          const lastDate = unit.lastTimeCollected
            ? new Date(unit.lastTimeCollected)
            : dateNow;

          const secondsElapsed =
            (dateNow.getTime() - lastDate.getTime()) / 1000;
          const accumulationRate = 1; // Assuming 1 unit per second for simplicity
          const accumulatedAmount =
            secondsElapsed * accumulationRate * Number(unit.level);

          const newResourceAmount =
            Math.floor(accumulatedAmount) + Number(unit.resourceAmount);

          await GameRepository.updateUnitResourcesAmount(
            unit.id,
            newResourceAmount // This will now be an integer
          );

          const updatedUnit = {
            ...unit,
            resourceAmount: newResourceAmount, // This will be an integer
            lastTimeCollected: dateNow.toISOString(),
          };

          updatedUnitsMap.set(unit.id, updatedUnit);
          return updatedUnit;
        })
    ); // End of Promise.all

    // Combine updated and non-updated units
    const finalUnits = units.map((unit) =>
      updatedUnitsMap.has(unit.id) ? updatedUnitsMap.get(unit.id) : unit
    );

    return {
      status: 200,
      message: "success",
      data: {
        ...game,
        units: finalUnits,
      },
    };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "error" };
  }
}
