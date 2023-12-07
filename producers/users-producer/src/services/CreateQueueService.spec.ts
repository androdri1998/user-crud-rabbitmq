import { ConfirmChannel } from "amqplib";
import config from "../config";
import QueueProvider from "../infra/providers/QueueProvider/RabbitMQProvider";
import CreateQueueService from "./CreateQueueService";

jest.mock("../infra/providers/QueueProvider/RabbitMQProvider");

describe("CreateQueueService test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should create a queue when execute method is called", async () => {
    const queueProvider = new QueueProvider("mock url connection");
    const createQueueService = new CreateQueueService(queueProvider);

    const queueProviderCreateExchangeSpyOn = jest.spyOn(
      queueProvider,
      "createExchange"
    );
    const queueProviderCreateQueueSpyOn = jest.spyOn(
      queueProvider,
      "createQueue"
    );
    const queueProviderBindQueueSpyOn = jest.spyOn(queueProvider, "bindQueue");

    const channel = {} as ConfirmChannel;

    const response = await createQueueService.execute({
      channel,
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.userExchange,
    });

    expect(queueProviderCreateExchangeSpyOn).toHaveBeenCalledWith({
      channel,
      name: config.rabbitMQ.exchanges.userExchange.name,
      type: config.rabbitMQ.exchanges.userExchange.type,
    });

    expect(queueProviderCreateQueueSpyOn).toHaveBeenCalledWith(
      channel,
      config.rabbitMQ.queues.createUsers.name
    );
    expect(queueProviderBindQueueSpyOn).toHaveBeenCalledWith({
      channel,
      exchangeName: config.rabbitMQ.exchanges.userExchange.name,
      queueName: config.rabbitMQ.queues.createUsers.name,
      routingKey: config.rabbitMQ.queues.createUsers.key,
    });
    expect(response).toBe(true);
  });
});
