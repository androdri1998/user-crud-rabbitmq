import config from "../config";
import QueueProvider from "../infra/providers/QueueProvider/RabbitMQProvider";
import ConnectQueueService from "./ConnectQueueService";
import CreateQueueService from "./CreateQueueService";

jest.mock("../infra/providers/QueueProvider/RabbitMQProvider");

describe("ConnectQueueService test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should connect to queue when execute method is called", async () => {
    const queueProvider = new QueueProvider("mock url connection");
    const createQueueService = new CreateQueueService(queueProvider);
    const connectQueueService = new ConnectQueueService(
      queueProvider,
      createQueueService
    );

    const createQueueServiceExecuteSpyOn = jest.spyOn(
      createQueueService,
      "execute"
    );
    const queueProviderConnectSpyOn = jest.spyOn(queueProvider, "connect");
    const queueProviderCreateChannelSpyOn = jest.spyOn(
      queueProvider,
      "createChannel"
    );

    const response = await connectQueueService.execute({
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.userExchange,
    });

    expect(queueProviderConnectSpyOn).toHaveBeenCalled();
    expect(queueProviderCreateChannelSpyOn).toHaveBeenCalledWith(
      response.connection
    );
    expect(createQueueServiceExecuteSpyOn).toHaveBeenCalledWith({
      channel: response.channel,
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.userExchange,
    });
    expect(response).toHaveProperty("connection");
    expect(response).toHaveProperty("channel");
  });
});
