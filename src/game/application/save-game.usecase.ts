import { GameData, GameRepository } from "../infra/game-repository";

export async function saveGameUseCase(data: GameData, userId: string) {
  try {
    const game = await GameRepository.getGameByPlayerId(userId);

    if (game) {
      await GameRepository.createGame(data);
      return { status: 200, message: "success" };
    }
    await GameRepository.updateGame(data);

    return { status: 200, message: "success" };
  } catch (error) {
    return { status: 500, message: "error" };
  }
}
