import fastify, { FastifyRequest } from "fastify";
import jwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import "dotenv/config";

export const app = fastify();

app.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});

app.register(fastifyRateLimit, {
  max: 50,
  timeWindow: "1 minute",
  keyGenerator: (request: FastifyRequest) => request.ip,
  errorResponseBuilder: (req, context) => {
    return {
      statusCode: 429,
      error: "Too Many Requests",
      message: `Rate limit exceeded, retry in ${Math.round(
        context.ttl / 1000
      )} seconds`,
    };
  },
});

const PORT = process.env.PORT || 3333;

const start = async () => {
  try {
    await import("./decorators");
    await import("./game/infra/game-state-controller");
    await import("./auth/infra/auth-controller");
    await import("./resources/infra/resources-controller");

    await app.listen({
      host: "0.0.0.0",
      port: PORT as number,
    });

    console.log("Servidor com Fastify em http://localhost:3333");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
