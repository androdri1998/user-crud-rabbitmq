import QueueProvider from "../providers/QueueProvider";
import * as ConnectQueueDTO from "./dto/ConnectQueueService.dto";
import CreateQueueService from "./CreateQueueService";
import * as CreateQueueDTO from "./dto/CreateQueueService.dto";

class ConnectQueueService implements ConnectQueueDTO.ConnectQueueService {
  queueProvider: QueueProvider;
  createQueueService: CreateQueueDTO.CreateQueueService;

  constructor(
    queueProvider: QueueProvider,
    createQueueService: CreateQueueService
  ) {
    this.queueProvider = queueProvider;
    this.createQueueService = createQueueService;
  }

  async execute({
    queue,
    exchange,
  }: ConnectQueueDTO.ConnectQueueServiceExecuteDTO): Promise<ConnectQueueDTO.ConnectQueueServiceExecuteResponse> {
    const connection = await this.queueProvider.connect();
    const channel = await this.queueProvider.createChannel(connection);

    await this.createQueueService.execute({ channel, queue, exchange });

    return { connection, channel };
  }
}

export default ConnectQueueService;
