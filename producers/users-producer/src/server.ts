import Fastify from "fastify";
import UsersController from "./controllers/UsersController";
import RabbitMQProvider from "./infra/providers/QueueProvider/RabbitMQProvider";
import config from "./config";
import CreateQueueService from "./services/CreateQueueService";
import ConnectQueueService from "./services/ConnectQueueService";
import PublishMessageService from "./services/PublishMessageService";
import createUserSchemaValidator from "./middlewares/createUserSchemaValidator";
import deleteUserSchemaValidator from "./middlewares/deleteUserSchemaValidator";

const fastify = Fastify({
  logger: true,
});

const queueProvider = new RabbitMQProvider(config.rabbitMQ.host);
const createQueueService = new CreateQueueService(queueProvider);
const connectQueueService = new ConnectQueueService(
  queueProvider,
  createQueueService
);
const createUserPublishMessageService = new PublishMessageService({
  queueProvider,
  connectQueueService,
  exchange: config.rabbitMQ.exchanges.userExchange,
  queue: config.rabbitMQ.queues.createUsers,
});
const deleteUserPublishMessageService = new PublishMessageService({
  queueProvider,
  connectQueueService,
  exchange: config.rabbitMQ.exchanges.userExchange,
  queue: config.rabbitMQ.queues.deleteUsers,
});

const usersController = new UsersController({
  createUserPublishMessageService,
  deleteUserPublishMessageService,
});

createUserSchemaValidator(fastify);
fastify.post("/users", {
  handler: usersController.create,
  schema: {
    body: {
      $ref: "createUserSchema#",
    },
  },
});

deleteUserSchemaValidator(fastify);
fastify.delete("/users/:id", {
  handler: usersController.detroy,
  schema: {
    params: {
      $ref: "deleteUserSchema#",
    },
  },
});

export default fastify;
