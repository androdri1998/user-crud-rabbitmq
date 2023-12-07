import { ConsumeMessage } from "amqplib";

export interface UserData {
  userId: number;
}

export interface DeleteUserService {
  execute: (user: ConsumeMessage | null) => Promise<void | undefined>;
}

export default DeleteUserService;
