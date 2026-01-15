import { collectorTypes } from "../../const";
import { GameRepository } from "../infra/game-repository";

export async function loadGameUseCase(playerId: string) {
  try {
    const game = await GameRepository.getGameByPlayerId(playerId);
    if (!game) {
      return { status: 404, message: "not found" };
    }
    console.log("game id", game.id);
    const units = await GameRepository.getGameUnitsyByGameId(game.id);
    if (!units || units.length === 0) {
      return { status: 404, message: "not found" };
    }

    const dateNow = new Date();
    const updatedUnitsMap = new Map<number, any>();

    // Process collector units sequentially to avoid race conditions
    for (const unit of units.filter((unit) =>
      collectorTypes.includes(Number(unit.typeId))
    )) {
      const lastDate = unit.lastTimeCollected
        ? new Date(unit.lastTimeCollected)
        : new Date(dateNow);

      const secondsElapsed = Math.max(
        0,
        (dateNow.getTime() - lastDate.getTime()) / 1000
      );

      const accumulationRate = 1; // 1 unit per second
      const accumulatedAmount =
        secondsElapsed * accumulationRate * Number(unit.level);

      const newResourceAmount =
        Math.floor(accumulatedAmount) + Number(unit.resourceAmount);

      console.log(
        `Unit ${
          unit.id
        }: Last collected: ${lastDate.toISOString()}, Seconds elapsed: ${secondsElapsed}, Accumulated: ${Math.floor(
          accumulatedAmount
        )}, New total: ${newResourceAmount}`
      );

      // Update both resource amount AND lastTimeCollected in the database
      await GameRepository.updateUnitResourcesAmount(
        unit.id ?? 0,
        newResourceAmount
      );

      const updatedUnit = {
        ...unit,
        resourceAmount: newResourceAmount,
        lastTimeCollected: dateNow.toISOString(),
      };

      updatedUnitsMap.set(unit.id!, updatedUnit);
      console.log(updatedUnitsMap);
    }

    // Combine updated and non-updated units
    const finalUnits = units.map((unit) =>
      updatedUnitsMap.has(unit.id!) ? updatedUnitsMap.get(unit.id!) : unit
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
    console.log("Error in loadGameUseCase:", error);
    return { status: 500, message: "error" };
  }
}
