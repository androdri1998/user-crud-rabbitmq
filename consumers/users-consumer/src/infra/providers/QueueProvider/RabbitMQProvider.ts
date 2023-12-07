import amqp, { Connection, Channel, ConfirmChannel } from "amqplib";
import * as QueueProviderDTO from "../../../providers/QueueProvider";

class RabbitMQProvider implements QueueProviderDTO.QueueProvider {
  urlConnection: string;

  constructor(urlConnection: string) {
    this.urlConnection = urlConnection;
  }

  async connect(): Promise<Connection> {
    const connection = await amqp.connect(this.urlConnection);
    return connection;
  }

  async closeConnection(connection: Connection): Promise<boolean> {
    await connection.close();
    return true;
  }

  async createConfirmChannel(connection: Connection): Promise<ConfirmChannel> {
    const channel = await connection.createConfirmChannel();
    return channel;
  }

  async createChannel(connection: Connection): Promise<Channel> {
    const channel = await connection.createChannel();
    return channel;
  }

  async createExchange({
    channel,
    name,
    type,
  }: QueueProviderDTO.CreateExchangeDTO): Promise<boolean> {
    await channel.assertExchange(name, type, { durable: false });
    return true;
  }

  async createQueue(
    channel: ConfirmChannel | Channel,
    name: string
  ): Promise<boolean> {
    await channel.assertQueue(name, { durable: false });
    return true;
  }

  async bindQueue({
    channel,
    exchangeName,
    queueName,
    routingKey,
  }: QueueProviderDTO.BindQueueDTO): Promise<boolean> {
    await channel.bindQueue(queueName, exchangeName, routingKey);
    return true;
  }

  async publish({
    confirmChannel,
    exchangeName,
    message,
    routingKey,
    onPublish,
  }: QueueProviderDTO.PublishDTO): Promise<boolean> {
    confirmChannel.publish(
      exchangeName,
      routingKey,
      Buffer.from(message),
      {},
      (err) => {
        if (err) {
          return;
        }

        if (onPublish) {
          onPublish();
        }
      }
    );
    return true;
  }

  async consume({
    channel,
    queueName,
    onMessage,
  }: QueueProviderDTO.ConsumeDTO): Promise<boolean> {
    channel.consume(queueName, onMessage, { noAck: true });
    return true;
  }
}

export default RabbitMQProvider;
