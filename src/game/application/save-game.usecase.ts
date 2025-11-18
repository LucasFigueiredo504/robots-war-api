import { GameData, GameRepository } from "../infra/game-repository";

export async function saveGameUseCase(data: GameData, userId: string) {
  try {
    const game = await GameRepository.getGameByPlayerId(userId);
    console.log(userId);
    if (game) {
      await GameRepository.updateGame(data, game.id);
      console.log("UPDATE");
      return { status: 200, message: "success" };
    }
    console.log("create");
    await GameRepository.createGame(data, userId);
    return { status: 200, message: "success" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "error" };
  }
}
