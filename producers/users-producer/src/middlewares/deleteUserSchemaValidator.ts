import { FastifyInstance } from "fastify";

const deleteUserSchemaValidator = (fastify: FastifyInstance): void => {
  fastify.addSchema({
    $id: "deleteUserSchema",
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  });
};

export default deleteUserSchemaValidator;
