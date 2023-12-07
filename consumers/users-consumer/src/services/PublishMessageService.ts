import QueueProvider from "../providers/QueueProvider";
import ConnectQueueByConfirmChannelService from "./dto/ConnectQueueByConfirmChannelService.dto";
import { ExchangeDTO, QueueDTO } from "./dto/CreateQueueService.dto";
import * as PublishMessageServiceDTO from "./dto/PublishMessageService.dto";

class PublishMessageService
  implements PublishMessageServiceDTO.PublishMessageService
{
  queueProvider: QueueProvider;
  connectQueueByConfirmChannelService: ConnectQueueByConfirmChannelService;
  queue: QueueDTO;
  exchange: ExchangeDTO;

  constructor({
    queueProvider,
    connectQueueByConfirmChannelService,
    queue,
    exchange,
  }: PublishMessageServiceDTO.PublishMessageServiceConstructorDTO) {
    this.queueProvider = queueProvider;
    this.connectQueueByConfirmChannelService =
      connectQueueByConfirmChannelService;
    this.queue = queue;
    this.exchange = exchange;
  }

  async execute<T>({
    data,
  }: PublishMessageServiceDTO.PublishMessageServiceExecuteDTO<T>): Promise<boolean> {
    const { connection, confirmChannel } =
      await this.connectQueueByConfirmChannelService.execute({
        queue: this.queue,
        exchange: this.exchange,
      });

    await this.queueProvider.publish({
      confirmChannel,
      exchangeName: this.exchange.name,
      routingKey: this.queue.key,
      message: JSON.stringify(data),
      onPublish: async () => {
        await this.queueProvider.closeConnection(connection);
      },
    });

    return true;
  }
}

export default PublishMessageService;
