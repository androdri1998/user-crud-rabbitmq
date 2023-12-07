import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", (request, reply) => {
  return reply.send({ message: "users-consumer running" });
});

export default fastify;
