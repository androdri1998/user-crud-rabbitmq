import config from "../config";
import QueueProvider from "../infra/providers/QueueProvider/RabbitMQProvider";
import ConnectQueueByConfirmChannelService from "./ConnectQueueByConfirmChannelService";
import CreateQueueService from "./CreateQueueService";

jest.mock("../infra/providers/QueueProvider/RabbitMQProvider");

describe("ConnectQueueByConfirmChannelService test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should connect to queue by confirm channel when execute method is called", async () => {
    const queueProvider = new QueueProvider("mock url connection");
    const createQueueService = new CreateQueueService(queueProvider);
    const connectQueueByConfirmChannelService =
      new ConnectQueueByConfirmChannelService(
        queueProvider,
        createQueueService
      );

    const createQueueServiceExecuteSpyOn = jest.spyOn(
      createQueueService,
      "execute"
    );
    const queueProviderConnectSpyOn = jest.spyOn(queueProvider, "connect");
    const queueProviderCreateConfirmChannelSpyOn = jest.spyOn(
      queueProvider,
      "createConfirmChannel"
    );

    const response = await connectQueueByConfirmChannelService.execute({
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.usersExchange,
    });

    expect(queueProviderConnectSpyOn).toHaveBeenCalled();
    expect(queueProviderCreateConfirmChannelSpyOn).toHaveBeenCalledWith(
      response.connection
    );
    expect(createQueueServiceExecuteSpyOn).toHaveBeenCalledWith({
      channel: response.confirmChannel,
      queue: config.rabbitMQ.queues.createUsers,
      exchange: config.rabbitMQ.exchanges.usersExchange,
    });
    expect(response).toHaveProperty("connection");
    expect(response).toHaveProperty("confirmChannel");
  });
});
