import { ConsumeMessage } from "amqplib";
import { ExchangeDTO, QueueDTO } from "./CreateQueueService.dto";
import QueueProvider from "../../providers/QueueProvider";
import ConnectQueueByChannelService from "./ConnectQueueByChannelService.dto";

export type onMessageFunction = (msg: ConsumeMessage | null) => void;

export interface ConsumerMessageServiceConstructorDTO {
  queueProvider: QueueProvider;
  connectQueueByChannelService: ConnectQueueByChannelService;
  queue: QueueDTO;
  exchange: ExchangeDTO;
}

export interface ConsumerMessageServiceExecuteDTO {
  onMessage: onMessageFunction;
}

export interface ConsumerMessageService {
  execute: (data: ConsumerMessageServiceExecuteDTO) => Promise<boolean>;
}
