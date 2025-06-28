import fastify from "fastify";

export const app = fastify();

const PORT = process.env.PORT || 3333;

const start = async () => {
  try {
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
