import { FastifyReply } from "fastify";
import {
  PublishMessageService,
  CreateUserDTO,
  DeleteUserDTO,
} from "../services/dto/PublishMessageService.dto";
import * as UsersControllerDTO from "./dto/UsersController.dto";

class UsersController implements UsersControllerDTO.UsersController {
  createUserPublishMessageService: PublishMessageService;
  deleteUserPublishMessageService: PublishMessageService;

  constructor({
    createUserPublishMessageService,
    deleteUserPublishMessageService,
  }: UsersControllerDTO.UsersControllerConstructorDTO) {
    this.createUserPublishMessageService = createUserPublishMessageService;
    this.deleteUserPublishMessageService = deleteUserPublishMessageService;

    this.create = this.create.bind(this);
    this.detroy = this.detroy.bind(this);
  }

  async create(
    request: UsersControllerDTO.CreateUserRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const user = request.body;

      await this.createUserPublishMessageService.execute<CreateUserDTO>({
        data: user,
      });

      return reply.code(200).send({ message: "User will be created" });
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ message: "Something went wrong" });
    }
  }

  async detroy(
    request: UsersControllerDTO.DeleteUserRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const userId: number = parseInt(request.params.id);

      await this.deleteUserPublishMessageService.execute<DeleteUserDTO>({
        data: { userId },
      });

      return reply.code(204).send();
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ message: "Something went wrong" });
    }
  }
}

export default UsersController;
