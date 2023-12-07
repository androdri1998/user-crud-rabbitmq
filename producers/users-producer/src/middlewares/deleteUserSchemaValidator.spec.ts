import Fastify from "fastify";
import deleteUserSchemaValidator from "./deleteUserSchemaValidator";

describe("deleteUserSchemaValidator test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should create fastify schema deleteUserSchemaValidator function method is called", async () => {
    const mockFastify = Fastify();

    const mockFastifyAddSchemaSpyOn = jest
      .spyOn(mockFastify, "addSchema")
      .mockImplementation(jest.fn());

    deleteUserSchemaValidator(mockFastify);

    expect(mockFastifyAddSchemaSpyOn).toHaveBeenCalledWith({
      $id: "deleteUserSchema",
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number" },
      },
    });
  });
});
