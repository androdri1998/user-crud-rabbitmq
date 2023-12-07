import { ConsumeMessage } from "amqplib";
import config from "../config";
import QueueProvider from "../infra/providers/QueueProvider/RabbitMQProvider";
import UsersTypeORMRepository from "../infra/repositories/UserRepository/UsersTypeORMRepository";
import ConnectQueueByConfirmChannelService from "./ConnectQueueByConfirmChannelService";
import CreateQueueService from "./CreateQueueService";
import PublishMessageService from "./PublishMessageService";
import DeleteUserService from "./DeleteUserService";
import { EntityManager } from "typeorm";
import { UserDTO } from "../repositories/UsersRepository";
import * as jsonHelper from "../helpers/jsonHelper";

jest.mock("../infra/providers/QueueProvider/RabbitMQProvider");
jest.mock("../infra/repositories/UserRepository/UsersTypeORMRepository");

describe("DeleteUserService test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should delete user when there's user", async () => {
    const mockUserData = { userId: 1 };
    const mockMessage = {
      content: Buffer.from(JSON.stringify(mockUserData)),
    } as ConsumeMessage;
    const date = new Date();

    const queueProvider = new QueueProvider("mock url connection");
    const createQueueService = new CreateQueueService(queueProvider);
    const connectQueueByConfirmChannelService =
      new ConnectQueueByConfirmChannelService(
        queueProvider,
        createQueueService
      );
    const deadLetterQueuePublishMessageService = new PublishMessageService({
      connectQueueByConfirmChannelService,
      queue: config.rabbitMQ.queues.deadLetterQueue,
      exchange: config.rabbitMQ.exchanges.usersExchange,
      queueProvider,
    });

    const userRepository = new UsersTypeORMRepository({} as EntityManager);
    const deleteUserService = new DeleteUserService(
      userRepository,
      deadLetterQueuePublishMessageService
    );

    const convertMessageToJSONSpyOn = jest.spyOn(
      jsonHelper,
      "convertMessageToJSON"
    );
    const deadLetterQueueExecuteSpyOn = jest.spyOn(
      deadLetterQueuePublishMessageService,
      "execute"
    );
    const userRepositoryDeleteByIdSpyOn = jest.spyOn(
      userRepository,
      "deleteById"
    );
    const userRepositoryGetByIdSpyOn = jest.spyOn(userRepository, "getById");
    userRepositoryGetByIdSpyOn.mockImplementation(
      jest.fn(
        async () =>
          ({
            id: mockUserData.userId,
            name: "test name",
            description: "test description",
            status: "Active",
            created_at: date,
            updated_at: date,
          } as UserDTO)
      )
    );

    await deleteUserService.execute(mockMessage);

    expect(userRepositoryGetByIdSpyOn).toHaveBeenCalledWith(
      mockUserData.userId
    );
    expect(convertMessageToJSONSpyOn).toHaveBeenCalledWith(mockMessage);
    expect(userRepositoryDeleteByIdSpyOn).toHaveBeenCalledWith(
      mockUserData.userId
    );
    expect(deadLetterQueueExecuteSpyOn).not.toHaveBeenCalled();
  });

  it("Should publish message to dead letter queue when there's no user", async () => {
    const mockUserData = { userId: 1 };
    const mockMessage = {
      content: Buffer.from(JSON.stringify(mockUserData)),
    } as ConsumeMessage;

    const queueProvider = new QueueProvider("mock url connection");
    const createQueueService = new CreateQueueService(queueProvider);
    const connectQueueByConfirmChannelService =
      new ConnectQueueByConfirmChannelService(
        queueProvider,
        createQueueService
      );
    const deadLetterQueuePublishMessageService = new PublishMessageService({
      connectQueueByConfirmChannelService,
      queue: config.rabbitMQ.queues.deadLetterQueue,
      exchange: config.rabbitMQ.exchanges.usersExchange,
      queueProvider,
    });

    const userRepository = new UsersTypeORMRepository({} as EntityManager);
    const deleteUserService = new DeleteUserService(
      userRepository,
      deadLetterQueuePublishMessageService
    );

    const convertMessageToJSONSpyOn = jest.spyOn(
      jsonHelper,
      "convertMessageToJSON"
    );
    const deadLetterQueueExecuteSpyOn = jest.spyOn(
      deadLetterQueuePublishMessageService,
      "execute"
    );
    const userRepositoryDeleteByIdSpyOn = jest.spyOn(
      userRepository,
      "deleteById"
    );
    const userRepositoryGetByIdSpyOn = jest.spyOn(userRepository, "getById");
    userRepositoryGetByIdSpyOn.mockImplementation(
      jest.fn(async () => undefined)
    );

    await deleteUserService.execute(mockMessage);

    expect(userRepositoryGetByIdSpyOn).toHaveBeenCalledWith(
      mockUserData.userId
    );
    expect(convertMessageToJSONSpyOn).toHaveBeenCalledWith(mockMessage);
    expect(userRepositoryDeleteByIdSpyOn).not.toHaveBeenCalled();
    expect(deadLetterQueueExecuteSpyOn).toHaveBeenCalledWith({
      data: mockUserData,
    });
  });

  it("Should return undefined when there's no message", async () => {
    const queueProvider = new QueueProvider("mock url connection");
    const createQueueService = new CreateQueueService(queueProvider);
    const connectQueueByConfirmChannelService =
      new ConnectQueueByConfirmChannelService(
        queueProvider,
        createQueueService
      );
    const deadLetterQueuePublishMessageService = new PublishMessageService({
      connectQueueByConfirmChannelService,
      queue: config.rabbitMQ.queues.deadLetterQueue,
      exchange: config.rabbitMQ.exchanges.usersExchange,
      queueProvider,
    });

    const userRepository = new UsersTypeORMRepository({} as EntityManager);
    const deleteUserService = new DeleteUserService(
      userRepository,
      deadLetterQueuePublishMessageService
    );

    const convertMessageToJSONSpyOn = jest.spyOn(
      jsonHelper,
      "convertMessageToJSON"
    );
    const deadLetterQueueExecuteSpyOn = jest.spyOn(
      deadLetterQueuePublishMessageService,
      "execute"
    );
    const userRepositoryDeleteByIdSpyOn = jest.spyOn(
      userRepository,
      "deleteById"
    );
    const userRepositoryGetByIdSpyOn = jest.spyOn(userRepository, "getById");

    const response = await deleteUserService.execute(null);

    expect(response).toBe(undefined);
    expect(convertMessageToJSONSpyOn).not.toHaveBeenCalled();
    expect(deadLetterQueueExecuteSpyOn).not.toHaveBeenCalled();
    expect(userRepositoryDeleteByIdSpyOn).not.toHaveBeenCalled();
    expect(userRepositoryGetByIdSpyOn).not.toHaveBeenCalled();
  });
});
