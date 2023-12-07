import { Channel, ConfirmChannel, Connection } from "amqplib";
import config from "../config";
import QueueProvider from "../infra/providers/QueueProvider/RabbitMQProvider";
import ConnectQueueByChannelService from "./ConnectQueueByChannelService";
import CreateQueueService from "./CreateQueueService";
import ConsumerMessageService from "./ConsumerMessageService";

jest.mock("../infra/providers/QueueProvider/RabbitMQProvider");

describe("ConsumerMessageService test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should consume messages from a queue when execute method is called", async () => {
    const channel = {} as Channel;
    const mockData = { test: "value" };

    const queueProvider = new QueueProvider("mock url connection");
    const createQueueService = new CreateQueueService(queueProvider);
    const connectQueueByChannelService = new ConnectQueueByChannelService(
      queueProvider,
      createQueueService
    );
    const consumerMessageService = new ConsumerMessageService({
      queueProvider,
      connectQueueByChannelService,
      exchange: config.rabbitMQ.exchanges.usersExchange,
      queue: config.rabbitMQ.queues.createUsers,
    });

    const queueProviderConsumeSpyOn = jest.spyOn(queueProvider, "consume");
    const connectQueueByChannelServiceExecuteSpyOn = jest.spyOn(
      connectQueueByChannelService,
      "execute"
    );
    connectQueueByChannelServiceExecuteSpyOn.mockImplementation(async () => ({
      connection: {} as Connection,
      channel,
    }));

    const onMessage = jest.fn();
    const response = await consumerMessageService.execute({ onMessage });

    expect(queueProviderConsumeSpyOn).toHaveBeenCalledWith({
      channel,
      queueName: config.rabbitMQ.queues.createUsers.name,
      onMessage,
    });
    expect(connectQueueByChannelServiceExecuteSpyOn).toHaveBeenCalledWith({
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.usersExchange,
    });
    expect(response).toBe(true);
  });
});
