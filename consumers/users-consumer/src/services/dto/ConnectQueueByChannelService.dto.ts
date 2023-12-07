import { Channel, Connection } from "amqplib";
import { ExchangeDTO, QueueDTO } from "./CreateQueueService.dto";

export interface ConnectQueueByChannelServiceExecuteDTO {
  queue: QueueDTO;
  exchange: ExchangeDTO;
}

export interface ConnectQueueByChannelServiceExecuteResponse {
  connection: Connection;
  channel: Channel;
}

export interface ConnectQueueByChannelService {
  execute: (
    data: ConnectQueueByChannelServiceExecuteDTO
  ) => Promise<ConnectQueueByChannelServiceExecuteResponse>;
}

export default ConnectQueueByChannelService;
