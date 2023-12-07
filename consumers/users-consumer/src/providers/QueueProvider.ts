import { Channel, ConfirmChannel, Connection } from "amqplib";
import { onMessageFunction } from "../services/dto/ConsumerMessageService.dto";

export type CreateExchangeDTO = {
  channel: ConfirmChannel | Channel;
  name: string;
  type: string;
};

export type BindQueueDTO = {
  channel: ConfirmChannel | Channel;
  queueName: string;
  exchangeName: string;
  routingKey: string;
};

export type PublishDTO = {
  confirmChannel: ConfirmChannel;
  exchangeName: string;
  routingKey: string;
  message: string;
  onPublish: () => Promise<void>;
};

export type ConsumeDTO = {
  channel: Channel;
  queueName: string;
  onMessage: onMessageFunction;
};

export interface QueueProvider {
  connect: () => Promise<Connection>;
  closeConnection: (connection: Connection) => Promise<boolean>;
  createConfirmChannel: (connection: Connection) => Promise<ConfirmChannel>;
  createChannel: (connection: Connection) => Promise<Channel>;
  createExchange: (data: CreateExchangeDTO) => Promise<boolean>;
  createQueue: (
    channel: ConfirmChannel | Channel,
    name: string
  ) => Promise<boolean>;
  bindQueue: (data: BindQueueDTO) => Promise<boolean>;
  publish: (data: PublishDTO) => Promise<boolean>;
  consume: (data: ConsumeDTO) => Promise<boolean>;
}

export default QueueProvider;
