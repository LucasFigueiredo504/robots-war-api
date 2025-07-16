import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { saveGameUseCase } from "../application/save-game.usecase";
import { GameData } from "./game-repository";
import { loadGameUseCase } from "../application/load-game.usecase";

app.post(
  "/game/save",
  {
    preHandler: [app.authenticate],
  },
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { data } = request.body as { data: GameData };
    const userId = (request.user as any).id;

    console.log("ID:", userId);
    const result = await saveGameUseCase(data, userId);

    if (result.status != 200) {
      return reply.status(500).send({ message: "Erro" });
    }
    return reply.status(200).send({ message: "success" });
  }
);

app.get(
  "/game/load",
  {
    preHandler: [app.authenticate],
  },
  async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as any).id;
    const result = await loadGameUseCase(userId);

    if (result.status != 200) {
      return reply.status(500).send({ message: "Erro" });
    }
    return reply.status(200).send({ message: "success", data: result });
  }
);
app.get("/game/alive", async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send({ message: "I am alive" });
});
