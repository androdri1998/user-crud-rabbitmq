import QueueProvider from "../providers/QueueProvider";
import ConnectQueueService from "./dto/ConnectQueueService.dto";
import { ExchangeDTO, QueueDTO } from "./dto/CreateQueueService.dto";
import * as PublishMessageServiceDTO from "./dto/PublishMessageService.dto";

class PublishMessageService
  implements PublishMessageServiceDTO.PublishMessageService
{
  queueProvider: QueueProvider;
  connectQueueService: ConnectQueueService;
  queue: QueueDTO;
  exchange: ExchangeDTO;

  constructor({
    queueProvider,
    connectQueueService,
    queue,
    exchange,
  }: PublishMessageServiceDTO.PublishMessageServiceConstructorDTO) {
    this.queueProvider = queueProvider;
    this.connectQueueService = connectQueueService;
    this.queue = queue;
    this.exchange = exchange;
  }

  async execute<T>({
    data,
  }: PublishMessageServiceDTO.PublishMessageServiceExecuteDTO<T>): Promise<boolean> {
    const { connection, channel } = await this.connectQueueService.execute({
      queue: this.queue,
      exchange: this.exchange,
    });

    await this.queueProvider.publish({
      channel,
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
