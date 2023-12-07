const config = {
  appPort: process.env.NODE_USERS_CONSUMER_PORT || "3002",
  nodeAppHost: process.env.NODE_APP_HOST || "127.0.0.1",
  mysql: {
    host: process.env.MYSQL_HOST || "localhost",
    database: process.env.MYSQL_DATABASE || "database",
    user: process.env.MYSQL_USER || "",
    password: process.env.MYSQL_PASSWORD || "",
    port: process.env.MYSQL_PORT || "3306",
  },
  rabbitMQ: {
    host: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${
      process.env.RABBITMQ_DEFAULT_PASS
    }@${process.env.RABBIMQ_HOST || "localhost"}:${
      process.env.AMQP_RABBITMQ_PORT
    }`,
    exchanges: {
      usersExchange: {
        name: "users",
        type: "direct",
      },
    },
    queues: {
      createUsers: { name: "create_users", key: "users.create" },
      deleteUsers: { name: "delete_users", key: "users.delete" },
      deadLetterQueue: {
        name: "dead_letter_queue",
        key: "users.dead_letter_queue",
      },
    },
  },
};

export default config;
