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
    console.log(data);
    const result = await saveGameUseCase(data, userId);

    return reply.status(result.status).send({ message: result.message });
  }
);

app.get(
  "/game/load",
  { preHandler: [app.authenticate] },
  async (request, reply) => {
    const userId = (request.user as any).id;

    const result = await loadGameUseCase(userId);

    return reply.status(result.status).send({ message: result.message });
  }
);

app.get("/game/alive", async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send({ message: "I am alive" });
});
