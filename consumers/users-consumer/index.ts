import "dotenv/config";
import "reflect-metadata";
import config from "./src/config";
import fastify from "./src/server";
import { AppDataSource } from "./src/infra/databases/typeorm/data-source";
import RabbitMQProvider from "./src/infra/providers/QueueProvider/RabbitMQProvider";
import ConsumerMessageService from "./src/services/ConsumerMessageService";
import ConnectQueueByChannelService from "./src/services/ConnectQueueByChannelService";
import CreateQueueService from "./src/services/CreateQueueService";
import { ConsumeMessage } from "amqplib";
import { convertMessageToJSON } from "./src/helpers/jsonHelper";
import UsersTypeORMRepository from "./src/infra/repositories/UserRepository/UsersTypeORMRepository";
import CreateUserService from "./src/services/CreateUserService";
import DeleteUserService from "./src/services/DeleteUserService";
import PublishMessageService from "./src/services/PublishMessageService";
import ConnectQueueByConfirmChannelService from "./src/services/ConnectQueueByConfirmChannelService";

AppDataSource.initialize().catch((err) => console.log(err));

const usersRepository = new UsersTypeORMRepository(AppDataSource.manager);
const queueProvider = new RabbitMQProvider(config.rabbitMQ.host);
const createQueueService = new CreateQueueService(queueProvider);
const connectQueueByChannelService = new ConnectQueueByChannelService(
  queueProvider,
  createQueueService
);
const connectQueueByConfirmChannelService =
  new ConnectQueueByConfirmChannelService(queueProvider, createQueueService);
const deadLetterQueuePublishMessageService = new PublishMessageService({
  connectQueueByConfirmChannelService,
  exchange: config.rabbitMQ.exchanges.usersExchange,
  queue: config.rabbitMQ.queues.deadLetterQueue,
  queueProvider,
});

const createUserConsumerMessageService = new ConsumerMessageService({
  queueProvider,
  connectQueueByChannelService,
  exchange: config.rabbitMQ.exchanges.usersExchange,
  queue: config.rabbitMQ.queues.createUsers,
});
const deleteUserConsumerMessageService = new ConsumerMessageService({
  queueProvider,
  connectQueueByChannelService,
  exchange: config.rabbitMQ.exchanges.usersExchange,
  queue: config.rabbitMQ.queues.deleteUsers,
});
const deadLetterQueueConsumerMessageService = new ConsumerMessageService({
  queueProvider,
  connectQueueByChannelService,
  exchange: config.rabbitMQ.exchanges.usersExchange,
  queue: config.rabbitMQ.queues.deadLetterQueue,
});

const createUserService = new CreateUserService(usersRepository);
createUserConsumerMessageService.execute({
  onMessage: createUserService.execute,
});

const deleteUserService = new DeleteUserService(
  usersRepository,
  deadLetterQueuePublishMessageService
);
deleteUserConsumerMessageService.execute({
  onMessage: deleteUserService.execute,
});

deadLetterQueueConsumerMessageService.execute({
  onMessage: (msg: ConsumeMessage | null) => {
    console.log("dead letter queue", convertMessageToJSON(msg));
  },
});

fastify.listen(
  { port: parseInt(config.appPort), host: config.nodeAppHost },
  function (err, _address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
);
