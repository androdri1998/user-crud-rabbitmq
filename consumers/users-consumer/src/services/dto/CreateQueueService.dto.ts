import { Channel, ConfirmChannel } from "amqplib";

export interface QueueDTO {
  name: string;
  key: string;
}

export interface ExchangeDTO {
  name: string;
  type: string;
}

export interface CreateQueueServiceExecuteDTO {
  channel: ConfirmChannel | Channel;
  queue: QueueDTO;
  exchange: ExchangeDTO;
}

export interface CreateQueueService {
  execute: (data: CreateQueueServiceExecuteDTO) => Promise<boolean>;
}

export default CreateQueueService;
