const bunyan = require('bunyan');

const logLevels = {
   TRACE: 'trace',
   DEBUG: 'debug',
   INFO: 'info',
   WARN: 'warn',
   ERROR: 'error',
   FATAL: 'fatal',
};
const defaultLogLevel = logLevels.TRACE;
const logger = bunyan.createLogger({ name: 'myapp', level: defaultLogLevel });

// https://github.com/trentm/node-bunyan#levels
logger.info('Use 6 log levels: trace, debug, info, warn, error, fatal');

logger.trace('Trace: world');
logger.debug('Debug: world');
logger.info('Info: world');
logger.warn('Warn: world');
logger.error('Error: world');
logger.fatal('Fatal: world');

logger.info('Rising log level to INFO');
logger.level(logLevels.INFO);

logger.info('Call trace');
logger.trace('Trace: world');

logger.info('Call info');
logger.info('Info: world');

logger.info('Use object');
logger.info({ foo: 'bar' }, 'hi');

logger.info('Use child logger');

function Wuzzle({ logger }) {
   this.logger = logger.child({ widget_type: 'wuzzle' });
   this.logger.info('creating a wuzzle');
}

Wuzzle.prototype.woos = function () {
   this.logger.warn('This wuzzle is woosey.');
};

logger.info('start');
const wuzzle = new Wuzzle({ logger });
wuzzle.woos();
logger.info('done');

const httpRequest = function (request) {
   return `Got ${request.method} on ${request.url} authenticated with ${request.headers.authentication}`;
};

const formattedLogger = bunyan.createLogger({
   name: 'myapp',
   serializers: {
      request: httpRequest,
   },
});

const aRequest = {
   method: 'GET',
   url: 'http://foo.com/bar',
   headers: {
      'content-type': 'JSON',
      authentication: 'Bearer Token 54a5d454azd6',
   },
};

logger.info(aRequest, 'Incoming request');

formattedLogger.info(
   {
      request: aRequest,
   },
   'Incoming request'
);
