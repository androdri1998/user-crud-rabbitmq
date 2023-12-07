import { ConsumeMessage } from "amqplib";
import { UsersRepository } from "../repositories/UsersRepository";
import * as DeleteUserServiceDTO from "./dto/DeleteUserService.dto";
import { convertMessageToJSON } from "../helpers/jsonHelper";
import { PublishMessageService } from "./dto/PublishMessageService.dto";

class DeleteUserService implements DeleteUserServiceDTO.DeleteUserService {
  usersRespository: UsersRepository;
  deadLetterQueuePublishMessageService: PublishMessageService;

  constructor(
    usersRespository: UsersRepository,
    deadLetterQueuePublishMessageService: PublishMessageService
  ) {
    this.usersRespository = usersRespository;
    this.deadLetterQueuePublishMessageService =
      deadLetterQueuePublishMessageService;

    this.execute = this.execute.bind(this);
  }

  async execute(data: ConsumeMessage | null): Promise<void | undefined> {
    if (!data) {
      return;
    }

    const user = convertMessageToJSON(data) as DeleteUserServiceDTO.UserData;
    const userExists = await this.usersRespository.getById(user.userId);

    if (userExists) {
      await this.usersRespository.deleteById(userExists.id);
      return;
    }

    await this.deadLetterQueuePublishMessageService.execute<DeleteUserServiceDTO.UserData>(
      { data: user }
    );
  }
}

export default DeleteUserService;
