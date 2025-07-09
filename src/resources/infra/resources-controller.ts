import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { getUnitById } from "../../game/application/get-unit-by-id.usecase";
import { collectResourceFromUserUnit } from "../application/collect-resource-from-user-unit.usecase";

app.post(
  "/game/resource/collect",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { gameId, collectorId } = request.body as {
      gameId: number;
      collectorId: number;
    };

    const result = await collectResourceFromUserUnit(gameId, collectorId);
    if (result?.status === 404) {
      return reply.status(404).send({ error: "Collector not found" });
    }

    return reply.status(200).send({ message: "success" });
  }
);
