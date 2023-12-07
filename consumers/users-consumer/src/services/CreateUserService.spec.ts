import { ConsumeMessage } from "amqplib";
import UsersTypeORMRepository from "../infra/repositories/UserRepository/UsersTypeORMRepository";
import CreateUserService from "./CreateUserService";
import { EntityManager } from "typeorm";
import * as jsonHelper from "../helpers/jsonHelper";
import { UserDTO } from "../repositories/UsersRepository";

jest.mock("../infra/providers/QueueProvider/RabbitMQProvider");
jest.mock("../infra/repositories/UserRepository/UsersTypeORMRepository");

describe("CreateUserService test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should create an user when there's no user", async () => {
    const mockUserData = {
      name: "test name",
      description: "test description",
    };
    const mockMessage = {
      content: Buffer.from(JSON.stringify(mockUserData)),
    } as ConsumeMessage;

    const userRepository = new UsersTypeORMRepository({} as EntityManager);
    const createUserService = new CreateUserService(userRepository);

    const convertMessageToJSONSpyOn = jest.spyOn(
      jsonHelper,
      "convertMessageToJSON"
    );
    const userRepositoryCreateSpyOn = jest.spyOn(userRepository, "create");
    const userRepositoryUpdateByIdSpyOn = jest.spyOn(
      userRepository,
      "updateById"
    );
    const userRepositoryGetByNameSpyOn = jest.spyOn(
      userRepository,
      "getByName"
    );
    userRepositoryGetByNameSpyOn.mockImplementation(
      jest.fn(async () => undefined)
    );

    await createUserService.execute(mockMessage);

    expect(convertMessageToJSONSpyOn).toHaveBeenCalledWith(mockMessage);
    expect(userRepositoryGetByNameSpyOn).toHaveBeenCalledWith(
      mockUserData.name
    );
    expect(userRepositoryCreateSpyOn).toHaveBeenCalledWith(mockUserData);
    expect(userRepositoryUpdateByIdSpyOn).not.toHaveBeenCalled();
  });

  it("Should update user when there's user", async () => {
    const mockUserData = {
      name: "test name",
      description: "test description",
    };
    const mockMessage = {
      content: Buffer.from(JSON.stringify(mockUserData)),
    } as ConsumeMessage;
    const date = new Date();

    const userRepository = new UsersTypeORMRepository({} as EntityManager);
    const createUserService = new CreateUserService(userRepository);

    const convertMessageToJSONSpyOn = jest.spyOn(
      jsonHelper,
      "convertMessageToJSON"
    );
    const userRepositoryCreateSpyOn = jest.spyOn(userRepository, "create");
    const userRepositoryUpdateByIdSpyOn = jest.spyOn(
      userRepository,
      "updateById"
    );
    const userRepositoryGetByNameSpyOn = jest.spyOn(
      userRepository,
      "getByName"
    );
    userRepositoryGetByNameSpyOn.mockImplementation(
      jest.fn(
        async () =>
          ({
            id: 1,
            name: mockUserData.name,
            description: "description",
            status: "Active",
            created_at: date,
            updated_at: date,
          } as UserDTO)
      )
    );

    await createUserService.execute(mockMessage);

    expect(convertMessageToJSONSpyOn).toHaveBeenCalledWith(mockMessage);
    expect(userRepositoryGetByNameSpyOn).toHaveBeenCalledWith(
      mockUserData.name
    );
    expect(userRepositoryUpdateByIdSpyOn).toHaveBeenCalledWith({
      id: 1,
      name: mockUserData.name,
      description: mockUserData.description,
      status: "Active",
      created_at: date,
      updated_at: date,
    });
    expect(userRepositoryCreateSpyOn).not.toHaveBeenCalled();
  });

  it("Should return undefined when there's no message", async () => {
    const userRepository = new UsersTypeORMRepository({} as EntityManager);
    const createUserService = new CreateUserService(userRepository);

    const convertMessageToJSONSpyOn = jest.spyOn(
      jsonHelper,
      "convertMessageToJSON"
    );
    const userRepositoryGetByNameSpyOn = jest.spyOn(
      userRepository,
      "getByName"
    );
    const userRepositoryCreateSpyOn = jest.spyOn(userRepository, "create");
    const userRepositoryUpdateByIdSpyOn = jest.spyOn(
      userRepository,
      "updateById"
    );

    const response = await createUserService.execute(null);

    expect(response).toBe(undefined);
    expect(convertMessageToJSONSpyOn).not.toHaveBeenCalled();
    expect(userRepositoryGetByNameSpyOn).not.toHaveBeenCalled();
    expect(userRepositoryCreateSpyOn).not.toHaveBeenCalled();
    expect(userRepositoryUpdateByIdSpyOn).not.toHaveBeenCalled();
  });
});
