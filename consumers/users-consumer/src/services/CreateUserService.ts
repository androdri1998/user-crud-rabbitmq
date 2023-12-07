import { ConsumeMessage } from "amqplib";
import { UsersRepository } from "../repositories/UsersRepository";
import * as CreateUserServiceDTO from "./dto/CreateUserService.dto";
import { convertMessageToJSON } from "../helpers/jsonHelper";

class CreateUserService implements CreateUserServiceDTO.CreateUserService {
  usersRespository: UsersRepository;

  constructor(usersRespository: UsersRepository) {
    this.usersRespository = usersRespository;

    this.execute = this.execute.bind(this);
  }

  async execute(data: ConsumeMessage | null): Promise<void | undefined> {
    if (!data) {
      return;
    }

    const user = convertMessageToJSON(data) as CreateUserServiceDTO.UserData;
    const userExists = await this.usersRespository.getByName(user.name);

    if (!userExists) {
      await this.usersRespository.create(user);
      return;
    }

    userExists.name = user.name;
    userExists.description = user.description;

    await this.usersRespository.updateById(userExists);
  }
}

export default CreateUserService;
