import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { saveGameUseCase } from "../application/save-game.usecase";
import { GameData } from "./game-repository";

app.post("/game/save", async (request: FastifyRequest, reply: FastifyReply) => {
  const { data } = request.body as { data: GameData };
  const result = await saveGameUseCase(data);

  if (result.status != 200) {
    return reply.status(500).send({ message: "Erro" });
  }
  return reply.status(200).send({ message: "success" });
});

app.get(
  "/game/load",
  async (request: FastifyRequest, reply: FastifyReply) => {}
);
