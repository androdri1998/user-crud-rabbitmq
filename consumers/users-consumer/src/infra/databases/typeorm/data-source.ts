import { DataSource } from "typeorm";
import config from "../../../config";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.mysql.host,
  port: parseInt(config.mysql.port),
  username: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});
