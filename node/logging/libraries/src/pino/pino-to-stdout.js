const pino = require("pino");
const dayjs = require("dayjs");

//https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/#customizing-the-default-fields
const configuration = {
   formatters: {
      level: (label) => {
         return { level: label.toUpperCase() };
      },
      bindings: (bindings) => {
         return {
            osProcessId: bindings.pid,
            serverName: bindings.hostname
         };
      }
   },
   timestamp: () => `,"on":"${dayjs().format("HH:mm:ss")}"`
};
const instance = pino(configuration);

module.exports = { logger: instance };


