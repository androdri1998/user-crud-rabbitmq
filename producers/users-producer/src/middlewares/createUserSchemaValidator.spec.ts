import Fastify from "fastify";
import createUserSchemaValidator from "./createUserSchemaValidator";

describe("createUserSchemaValidator test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should create fastify schema createUserSchemaValidator function method is called", async () => {
    const mockFastify = Fastify();

    const mockFastifyAddSchemaSpyOn = jest
      .spyOn(mockFastify, "addSchema")
      .mockImplementation(jest.fn());

    createUserSchemaValidator(mockFastify);

    expect(mockFastifyAddSchemaSpyOn).toHaveBeenCalledWith({
      $id: "createUserSchema",
      type: "object",
      required: ["name", "description"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
      },
    });
  });
});
