import { ConfirmChannel, Connection } from "amqplib";
import { ExchangeDTO, QueueDTO } from "./CreateQueueService.dto";

export interface ConnectQueueByConfirmChannelServiceExecuteDTO {
  queue: QueueDTO;
  exchange: ExchangeDTO;
}

export interface ConnectQueueByConfirmChannelServiceExecuteResponse {
  connection: Connection;
  confirmChannel: ConfirmChannel;
}

export interface ConnectQueueByConfirmChannelService {
  execute: (
    data: ConnectQueueByConfirmChannelServiceExecuteDTO
  ) => Promise<ConnectQueueByConfirmChannelServiceExecuteResponse>;
}

export default ConnectQueueByConfirmChannelService;
