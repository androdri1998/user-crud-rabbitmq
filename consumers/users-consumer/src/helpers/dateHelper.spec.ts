import { formatDatetime } from "./dateHelper";

describe("dateHelper test suit", () => {
  it("should return a date in string format when formatDatetime is called", () => {
    const date = new Date(2023, 11, 30);
    date.setHours(0, 0, 0, 0);

    const expectResponse = "2023-12-30 00:00:00";

    const response = formatDatetime(date);

    expect(expectResponse).toBe(response);
  });
});
