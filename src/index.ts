import fastify from "fastify";
import jwt from "@fastify/jwt";

export const app = fastify();

app.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});

const PORT = process.env.PORT || 3333;

const start = async () => {
  try {
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
