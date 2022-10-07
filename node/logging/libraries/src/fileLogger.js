const fs = require('fs');
const pino = require('pino');

const logFilePath = '/tmp/pino-test.log'
const logger = pino(
   {},
   pino.destination({
      // dest: process.stdout.fd,
      dest: logFilePath,
      // minLength: 1024,
      sync: true,
   })
);

(async () => {
   // append mode only - you need to truncate the file by yourself
   fs.truncateSync(logFilePath)
   const message = `an error occurred`
   logger.error(message);
})();
