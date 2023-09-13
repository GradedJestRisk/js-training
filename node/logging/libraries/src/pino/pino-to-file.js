const fs = require("fs");
const pino = require("pino");

const logFilePath = "/tmp/pino-file.log";
const configuration = {};

const destinationLogger = pino(
   configuration,
   pino.destination({
      // dest: process.stdout.fd,
      dest: logFilePath,
      // minLength: 1024,
      sync: true
   })
);

const fileTransport = pino.transport({
   target: "pino/file",
   options: { destination: logFilePath }
});

const transportLogger = pino(configuration, fileTransport);

//  Note that the pino/file transport uses pino.destination() under the hood.
//  The main difference between the two is that the former runs in a worker thread
//   while the latter runs in the main thread.
const logger = destinationLogger;
// const logger = transportLogger;

module.exports = { logger };

// (async () => {
//    // append mode only - you need to truncate the file by yourself
//    fs.truncateSync(logFilePath)
//    const message = `an error occurred`
//    logger.error(message);
// })();
