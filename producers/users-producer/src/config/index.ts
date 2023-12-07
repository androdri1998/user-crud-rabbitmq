const config = {
  appPort: process.env.NODE_USERS_PRODUCER_PORT || "3001",
  nodeAppHost: process.env.NODE_APP_HOST || "127.0.0.1",
  rabbitMQ: {
    host: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${
      process.env.RABBITMQ_DEFAULT_PASS
    }@${process.env.RABBIMQ_HOST || "localhost"}:${
      process.env.AMQP_RABBITMQ_PORT
    }`,
    exchanges: {
      userExchange: {
        name: "users",
        type: "direct",
      },
    },
    queues: {
      createUsers: { name: "create_users", key: "users.create" },
      deleteUsers: { name: "delete_users", key: "users.delete" },
    },
  },
};

export default config;
