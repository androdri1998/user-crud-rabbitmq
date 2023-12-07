import { ConfirmChannel, Connection } from "amqplib";
import { ExchangeDTO, QueueDTO } from "./CreateQueueService.dto";

export interface ConnectQueueServiceExecuteDTO {
  queue: QueueDTO;
  exchange: ExchangeDTO;
}

export interface ConnectQueueServiceExecuteResponse {
  connection: Connection;
  channel: ConfirmChannel;
}

export interface ConnectQueueService {
  execute: (
    data: ConnectQueueServiceExecuteDTO
  ) => Promise<ConnectQueueServiceExecuteResponse>;
}

export default ConnectQueueService;
