import { ConfirmChannel, Connection } from "amqplib";
import config from "../config";
import QueueProvider from "../infra/providers/QueueProvider/RabbitMQProvider";
import ConnectQueueService from "./ConnectQueueService";
import CreateQueueService from "./CreateQueueService";
import PublishMessageService from "./PublishMessageService";

jest.mock("../infra/providers/QueueProvider/RabbitMQProvider");

describe("PublishMessageService test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should publish a message to queue when execute method is called", async () => {
    const channel = {} as ConfirmChannel;
    const mockData = { test: "value" };

    const queueProvider = new QueueProvider("mock url connection");
    const createQueueService = new CreateQueueService(queueProvider);
    const connectQueueService = new ConnectQueueService(
      queueProvider,
      createQueueService
    );
    const publishMessageService = new PublishMessageService({
      connectQueueService,
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.userExchange,
      queueProvider,
    });

    const queueProviderPublishSpyOn = jest.spyOn(queueProvider, "publish");
    const connectQueueServiceExecuteSpyOn = jest.spyOn(
      connectQueueService,
      "execute"
    );
    connectQueueServiceExecuteSpyOn.mockImplementation(async () => ({
      connection: {} as Connection,
      channel,
    }));

    const response = await publishMessageService.execute({ data: mockData });

    expect(queueProviderPublishSpyOn).toHaveBeenCalledWith(
      expect.objectContaining({
        channel,
        exchangeName: config.rabbitMQ.exchanges.userExchange.name,
        routingKey: config.rabbitMQ.queues.createUsers.key,
        message: JSON.stringify(mockData),
        onPublish: expect.any(Function),
      })
    );
    expect(connectQueueServiceExecuteSpyOn).toHaveBeenCalledWith({
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.userExchange,
    });
    expect(response).toBe(true);
  });
});
