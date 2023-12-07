import { ConsumeMessage } from "amqplib";

export const convertMessageToJSON = (msg: ConsumeMessage | null) => {
  if (!msg) {
    return msg;
  }

  return JSON.parse(msg.content.toString());
};
