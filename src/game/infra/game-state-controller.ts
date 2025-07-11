import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { saveGameUseCase } from "../application/save-game.usecase";
import { GameData } from "./game-repository";
import { loadGameUseCase } from "../application/load-game.usecase";

app.post("/game/save", async (request: FastifyRequest, reply: FastifyReply) => {
  const { data } = request.body as { data: GameData };
  const result = await saveGameUseCase(data);

  if (result.status != 200) {
    return reply.status(500).send({ message: "Erro" });
  }
  return reply.status(200).send({ message: "success" });
});

app.get("/game/load", async (request: FastifyRequest, reply: FastifyReply) => {
  const { playerId } = request.body as { playerId: string };
  const result = await loadGameUseCase(playerId);

  if (result.status != 200) {
    return reply.status(500).send({ message: "Erro" });
  }
  return reply.status(200).send({ message: "success", data: result });
});
app.get("/game/alive", async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send({ message: "I am alive" });
});
