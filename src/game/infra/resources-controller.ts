import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";
import { getUnitById } from "../application/get-unit-by-id.usecase";

app.post(
  "/game/resource/collect",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { gameId, collectorId } = request.body as {
      gameId: string;
      collectorId: number;
    };

    const result = await getUnitById(collectorId);
    if (!result.data) {
      return reply.status(404).send({ error: "Collector not found" });
    }
    const newResourceAmount = await collectResourceFromUserUnit(
      gameId,
      collectorId
    );
    return reply
      .status(200)
      .send({ message: "success", data: { newResourceAmount } });
  }
);
