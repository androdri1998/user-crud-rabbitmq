import QueueProvider from "../../providers/QueueProvider";
import ConnectQueueByConfirmChannelService from "./ConnectQueueByConfirmChannelService.dto";
import { ExchangeDTO, QueueDTO } from "./CreateQueueService.dto";

export interface PublishMessageServiceConstructorDTO {
  queue: QueueDTO;
  exchange: ExchangeDTO;
  queueProvider: QueueProvider;
  connectQueueByConfirmChannelService: ConnectQueueByConfirmChannelService;
}

export interface PublishMessageServiceExecuteDTO<T> {
  data: T;
}

export interface PublishMessageService {
  execute: <T>(data: PublishMessageServiceExecuteDTO<T>) => Promise<boolean>;
}
