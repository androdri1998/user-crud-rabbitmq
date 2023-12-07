import QueueProvider from "../providers/QueueProvider";
import ConnectQueueByChannelService from "./dto/ConnectQueueByChannelService.dto";
import * as ConsumerMessageServiceDTO from "./dto/ConsumerMessageService.dto";
import { ExchangeDTO, QueueDTO } from "./dto/CreateQueueService.dto";

class ConsumerMessageService
  implements ConsumerMessageServiceDTO.ConsumerMessageService
{
  queueProvider: QueueProvider;
  connectQueueByChannelService: ConnectQueueByChannelService;
  queue: QueueDTO;
  exchange: ExchangeDTO;

  constructor({
    queueProvider,
    connectQueueByChannelService,
    exchange,
    queue,
  }: ConsumerMessageServiceDTO.ConsumerMessageServiceConstructorDTO) {
    this.queueProvider = queueProvider;
    this.connectQueueByChannelService = connectQueueByChannelService;
    this.exchange = exchange;
    this.queue = queue;
  }

  async execute({
    onMessage,
  }: ConsumerMessageServiceDTO.ConsumerMessageServiceExecuteDTO): Promise<boolean> {
    const { channel } = await this.connectQueueByChannelService.execute({
      queue: this.queue,
      exchange: this.exchange,
    });

    await this.queueProvider.consume({
      channel,
      onMessage,
      queueName: this.queue.name,
    });

    return true;
  }
}

export default ConsumerMessageService;
