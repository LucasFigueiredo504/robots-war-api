import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../..";

app.post(
  "/game/save",
  async (request: FastifyRequest, reply: FastifyReply) => {}
);

app.get(
  "/game/load",
  async (request: FastifyRequest, reply: FastifyReply) => {}
);
