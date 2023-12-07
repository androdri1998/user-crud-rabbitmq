import "dotenv/config";
import config from "./src/config";
import fastify from "./src/server";

fastify.listen(
  { port: parseInt(config.appPort), host: config.nodeAppHost },
  function (err, _address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
);
