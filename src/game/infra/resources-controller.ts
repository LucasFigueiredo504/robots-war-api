import { app } from "../..";
import { getUnitById } from "../application/get-unit-by-id";

app.post("/game/resource/collect", async (request, reply) => {
  const { gameId, collectorId } = request.body;

  const result = await getUnitById(collectorId);
  if (!result.data) {
    reply.status = 404;
  }
  const newResourceAmount = await collectResourceFromUserUnit(
    gameId,
    collectorId
  );
});
