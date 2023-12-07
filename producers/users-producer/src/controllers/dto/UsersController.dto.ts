import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateUserDTO,
  PublishMessageService,
} from "../../services/dto/PublishMessageService.dto";

export interface UsersControllerConstructorDTO {
  createUserPublishMessageService: PublishMessageService;
  deleteUserPublishMessageService: PublishMessageService;
}

export type CreateUserRequest = FastifyRequest<{
  Body: CreateUserDTO;
}>;

export type DeleteUserRequest = FastifyRequest<{
  Params: {
    id: string;
  };
}>;

export interface UsersController {
  create: (
    request: CreateUserRequest,
    reply: FastifyReply
  ) => Promise<FastifyReply>;
  detroy: (
    request: DeleteUserRequest,
    reply: FastifyReply
  ) => Promise<FastifyReply>;
}

export default UsersController;
