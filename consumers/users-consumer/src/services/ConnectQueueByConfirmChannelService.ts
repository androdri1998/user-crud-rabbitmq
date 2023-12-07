import QueueProvider from "../providers/QueueProvider";
import * as ConfirmChannelServiceDTO from "./dto/ConnectQueueByConfirmChannelService.dto";
import CreateQueueService from "./CreateQueueService";
import * as CreateQueueDTO from "./dto/CreateQueueService.dto";

class ConnectQueueByConfirmChannelService
  implements ConfirmChannelServiceDTO.ConnectQueueByConfirmChannelService
{
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
  }: ConfirmChannelServiceDTO.ConnectQueueByConfirmChannelServiceExecuteDTO): Promise<ConfirmChannelServiceDTO.ConnectQueueByConfirmChannelServiceExecuteResponse> {
    const connection = await this.queueProvider.connect();
    const confirmChannel = await this.queueProvider.createConfirmChannel(
      connection
    );

    await this.createQueueService.execute({
      channel: confirmChannel,
      queue,
      exchange,
    });

    return { connection, confirmChannel };
  }
}

export default ConnectQueueByConfirmChannelService;
