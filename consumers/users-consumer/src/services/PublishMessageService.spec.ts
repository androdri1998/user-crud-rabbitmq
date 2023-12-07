import { ConfirmChannel, Connection } from "amqplib";
import config from "../config";
import QueueProvider from "../infra/providers/QueueProvider/RabbitMQProvider";
import ConnectQueueByConfirmChannelService from "./ConnectQueueByConfirmChannelService";
import CreateQueueService from "./CreateQueueService";
import PublishMessageService from "./PublishMessageService";

jest.mock("../infra/providers/QueueProvider/RabbitMQProvider");

describe("PublishMessageService test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should publish a message to queue when execute method is called", async () => {
    const confirmChannel = {} as ConfirmChannel;
    const mockData = { test: "value" };

    const queueProvider = new QueueProvider("mock url connection");
    const createQueueService = new CreateQueueService(queueProvider);
    const connectQueueByConfirmChannelService =
      new ConnectQueueByConfirmChannelService(
        queueProvider,
        createQueueService
      );
    const publishMessageService = new PublishMessageService({
      connectQueueByConfirmChannelService,
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.usersExchange,
      queueProvider,
    });

    const queueProviderPublishSpyOn = jest.spyOn(queueProvider, "publish");
    const connectQueueByConfirmChannelServiceExecuteSpyOn = jest.spyOn(
      connectQueueByConfirmChannelService,
      "execute"
    );
    connectQueueByConfirmChannelServiceExecuteSpyOn.mockImplementation(
      async () => ({
        connection: {} as Connection,
        confirmChannel,
      })
    );

    const response = await publishMessageService.execute({ data: mockData });

    expect(queueProviderPublishSpyOn).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmChannel,
        exchangeName: config.rabbitMQ.exchanges.usersExchange.name,
        routingKey: config.rabbitMQ.queues.createUsers.key,
        message: JSON.stringify(mockData),
        onPublish: expect.any(Function),
      })
    );
    expect(
      connectQueueByConfirmChannelServiceExecuteSpyOn
    ).toHaveBeenCalledWith({
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.usersExchange,
    });
    expect(response).toBe(true);
  });
});
