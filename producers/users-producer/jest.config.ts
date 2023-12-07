import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.[tj]s?$": "ts-jest",
  },
};

export default config;
