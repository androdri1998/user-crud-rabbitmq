import QueueProvider from "../../providers/QueueProvider";
import ConnectQueueService from "./ConnectQueueService.dto";
import { ExchangeDTO, QueueDTO } from "./CreateQueueService.dto";

export interface CreateUserDTO {
  name: string;
  description: string;
}

export interface DeleteUserDTO {
  userId: number;
}

export interface PublishMessageServiceConstructorDTO {
  queue: QueueDTO;
  exchange: ExchangeDTO;
  queueProvider: QueueProvider;
  connectQueueService: ConnectQueueService;
}

export interface PublishMessageServiceExecuteDTO<T> {
  data: T;
}

export interface PublishMessageService {
  execute: <T>(data: PublishMessageServiceExecuteDTO<T>) => Promise<boolean>;
}
