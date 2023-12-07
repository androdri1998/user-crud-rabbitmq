import amqp, { Connection, ConfirmChannel } from "amqplib";
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

  async createChannel(connection: Connection): Promise<ConfirmChannel> {
    const channel = await connection.createConfirmChannel();
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

  async createQueue(channel: ConfirmChannel, name: string): Promise<boolean> {
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
    channel,
    exchangeName,
    message,
    routingKey,
    onPublish,
  }: QueueProviderDTO.PublishDTO): Promise<boolean> {
    channel.publish(
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
}

export default RabbitMQProvider;
