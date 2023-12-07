import { ConsumeMessage } from "amqplib";

export interface UserData {
  name: string;
  description: string;
}

export interface CreateUserService {
  execute: (user: ConsumeMessage | null) => Promise<void | undefined>;
}

export default CreateUserService;
