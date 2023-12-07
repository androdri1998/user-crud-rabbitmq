import { FastifyInstance } from "fastify";

const createUserSchemaValidator = (fastify: FastifyInstance): void => {
  fastify.addSchema({
    $id: "createUserSchema",
    type: "object",
    required: ["name", "description"],
    properties: {
      name: { type: "string" },
      description: { type: "string" },
    },
  });
};

export default createUserSchemaValidator;
