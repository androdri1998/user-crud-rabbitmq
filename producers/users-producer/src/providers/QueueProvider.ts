import { ConfirmChannel, Connection } from "amqplib";

export type CreateExchangeDTO = {
  channel: ConfirmChannel;
  name: string;
  type: string;
};

export type BindQueueDTO = {
  channel: ConfirmChannel;
  queueName: string;
  exchangeName: string;
  routingKey: string;
};

export type PublishDTO = {
  channel: ConfirmChannel;
  exchangeName: string;
  routingKey: string;
  message: string;
  onPublish: () => Promise<void>;
};

export interface QueueProvider {
  connect: () => Promise<Connection>;
  closeConnection: (connection: Connection) => Promise<boolean>;
  createChannel: (connection: Connection) => Promise<ConfirmChannel>;
  createExchange: (data: CreateExchangeDTO) => Promise<boolean>;
  createQueue: (channel: ConfirmChannel, name: string) => Promise<boolean>;
  bindQueue: (data: BindQueueDTO) => Promise<boolean>;
  publish: (data: PublishDTO) => Promise<boolean>;
}

export default QueueProvider;
