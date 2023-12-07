import { ConsumeMessage } from "amqplib";
import { convertMessageToJSON } from "./jsonHelper";

describe("jsonHelper test suit", () => {
  it("should return json when convertMessageToJSON is called given a message", () => {
    const mockMessage = { test: "value" };
    const message = {
      content: Buffer.from(JSON.stringify(mockMessage)),
    } as ConsumeMessage;

    const response = convertMessageToJSON(message);

    expect(response).toEqual(mockMessage);
  });

  it("should return null when convertMessageToJSON is called given a null message", () => {
    const response = convertMessageToJSON(null);

    expect(response).toBe(null);
  });
});
