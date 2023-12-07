import QueueProvider from "../providers/QueueProvider";
import * as CreateQueueDTO from "./dto/CreateQueueService.dto";

class CreateQueueService implements CreateQueueDTO.CreateQueueService {
  queueProvider: QueueProvider;

  constructor(queueProvider: QueueProvider) {
    this.queueProvider = queueProvider;
  }

  async execute({
    channel,
    queue,
    exchange,
  }: CreateQueueDTO.CreateQueueServiceExecuteDTO): Promise<boolean> {
    await this.queueProvider.createExchange({
      channel,
      name: exchange.name,
      type: exchange.type,
    });

    await this.queueProvider.createQueue(channel, queue.name);

    await this.queueProvider.bindQueue({
      channel,
      exchangeName: exchange.name,
      queueName: queue.name,
      routingKey: queue.key,
    });

    return true;
  }
}

export default CreateQueueService;
