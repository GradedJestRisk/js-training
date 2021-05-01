const pino = require('pino');

const timeFormat = {
  full: true,          // display time in human-readable, not second from epoch
  omitDay : 'h:MM:ss' // https://www.npmjs.com/package/dateformat
}

// https://github.com/pinojs/pino-pretty
const pinoPrettyOptions = {
   colorize: true, // use chalk to colorize
   translateTime: timeFormat.omitDay,
   ignore: 'pid,hostname', // Hide process ID and hostname
}

const logger = pino({
   prettyPrint: pinoPrettyOptions
})

logger.info('Use 6 log levels: trace, debug, info, warn, error, fatal');

logger.trace('Trace: world');
logger.debug('Debug: world');
logger.info('Info: world');
logger.warn('Warn: world');
logger.error('Error: world');

// Raise an additional warn because of clash with pino-pretty
//  WARN : pino.final with prettyPrint does not support flushing
logger.fatal('Fatal: world');

logger.info('Display Error objects');

logger.info(new Error("I am an error"))

logger.info('Display child');
const child = logger.child({ a: 'property' });
child.info('hello child!');



