require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Stream = require('stream');
const dayjs = require('dayjs');
const bunyan = require('bunyan');
const chalk = require('chalk');

let logBunyan;

if (process.env.LOG_BUNYAN === 'yes') {
   logBunyan = true;
}

const routesConfiguration = require('./routes');

const customEvent = 'custom-event';

process.on('unhandledRejection', (err) => {
   console.log(err);
   process.exit(1);
});

// Initializes the server (starts the caches, finalizes plugin registration)
// but does not start listening on the connection port.
const initialize = async () => {

   const server = createServer();

   registerRoutes(server);

   await registerPlugins(server);

   await server.initialize();

   return server;
};

const start = async () => {

   const server = createServer();

   registerRoutes(server);

   await registerPlugins(server);

   registerNativeEvents(server);
   registerCustomEvents(server);

   await server.start();

   await server.events.emit('custom-event', 'emitted in start()');
   server.log('info', 'native log event (info level) emitted in start()');
   server.log('trace', 'native log event (trace level) emitted in start()');

   return server;
};

const createServer = function () {
   return Hapi.server({
      port: 3000,
      host: 'localhost'
   });
}

const registerRoutes = function (server) {
   server.route(routesConfiguration);
}

const registerPlugins = async function (server) {

   await monitorUncatchedErrors(server);

   await showStackTrace(server);

   await showRoutingTableOnStartup(server);

   await setupLogging(server);

   await monitorServer(server);

}

const monitorServer = async(server)=>{

   await monitorServerLocally(server);

   await monitorServerRemotely(server);

}

const setupLogging = async(server)=>{
   await registerLoggingWithLaabr(server);
   await registerLoggingWithGood(server);
}

const monitorUncatchedErrors = async(server)=>{
   const sentryOptions = {
      client: {dsn: process.env.SENTRY_DSN},
   }

   await server.register({
      plugin: require('hapi-sentry'),
      options: sentryOptions,
   });
}

const showStackTrace = async(server)=>{
   await server.register({
      plugin: require('hapi-dev-errors'),
      options: {
         showErrors: process.env.NODE_ENV !== 'production'
      }
   })
}

const showRoutingTableOnStartup = async(server)=>{
   const blippOptions = {};
   await server.register({
      plugin: require('blipp'),
      options: blippOptions
   });
}

const monitorServerLocally = async(server)=>{
   const monitoringOptions = {
      title: 'My Status Monitor',
      routeConfig: {
         auth: false
      }
   };

   await server.register({
      plugin: require('hapijs-status-monitor'),
      options: monitoringOptions
   });

}

const monitorServerRemotely = async(server)=>{

   await exposeHealthCheck(server);

   await exposePrometheus(server);

}

const exposePrometheus = async(server)=>{
   const prometheusOptions = {
      livenessProbes: {
         status: () => Promise.resolve('Yeah !')
      },
      readinessProbes: {
         sequelize: () => container.sequelize.authenticate()
      }
   }

   await server.register({
      plugin: require('hapi-k8s-health').HealthPlugin,
      options: prometheusOptions
   })
}


const exposeHealthCheck = async(server)=>{
   const healthcheckOptions = {
      path: '/healthcheck',
      tags: ['health', 'monitor'],
      responses: {
         healthy: {
            message: 'Server up and running'
         },
      },
      healthCheck: async function (server) {
         //throw new Error('Server not healthy');
         return true;
      }
   };

   await server.register({
      plugin: require('hapi-alive'),
      options: healthcheckOptions
   });
}


const registerLoggingWithGood = async (server) => {

   let logServerState;
   let logRequests;
   let logMessage;
   let logCustom;
   let logCustomBunyan;

   if (process.env.LOG_REQUEST_GOOD === 'yes') {
      logRequests = true;
   }
   if (process.env.LOG_MESSAGE_GOOD === 'yes') {
      logMessage = true;
   }
   if (process.env.LOG_SERVER_STATE === 'yes') {
      logServerState = true;
   }
   if (process.env.LOG_CUSTOM_GOOD === 'yes') {
      logCustom = true;
   }
   if (process.env.LOG_CUSTOM_GOOD_BUNYAN === 'yes') {
      logCustomBunyan = true;
   }
   const eventToKeep = {
      response: '*',
      log: '*',
      ops: '*'
   }

   if (!logRequests) {
      delete eventToKeep.response;
   }
   if (!logMessage) {
      delete eventToKeep.log;
   }
   if (!logServerState) {
      delete eventToKeep.ops;
   }

   const eachFiveSecond = 5 * 1000;
   const goodOptions = {
      ops: {
         interval: eachFiveSecond
      }
   }

   if (!logCustom) {
      goodOptions.reporters = {
         myConsoleReporter: [
            {
               module: 'good-squeeze',
               name: 'Squeeze',
               args: [eventToKeep],
            },
            {
               module: '@hapi/good-console'
            },
            'stdout'
         ]
      }

   } else {

      class aLogTransformer extends Stream.Transform {

         constructor() {
            super({objectMode: true});
         }

         _transform(data, enc, next) {
            const now = dayjs().format('HH:mm:ss');

            if (data.event === 'log' && logMessage) {
               if (data.data) {
                  const message = `${data.event}: ${now}: ${data.data}\n`;
                  return next(null, message);
               }
            }

            if (data.event === 'response' && logRequests) {

               // Original library format (but time)
               // 210502/125555.092, (1619960155092:OCTO-TOPI:64181:ko76g2zo:10000) [response] http://localhost:3000: get /foo {} 200 (8ms)
               //const message = `${now}: (${data.id}) [${data.event}] ${data.instance} ${data.method} ${data.path} ${data.statusCode} (${data.responseTime}ms) \n`

               let colorName;
               const httpStatutsCodePrefix = data.statusCode.toString()[0];
               if(httpStatutsCodePrefix === '2'){
                  colorName = 'green';
               } else if (httpStatutsCodePrefix === '4'){
                  colorName = 'orange';
               } else if (httpStatutsCodePrefix === '5'){
                  colorName = 'red';
               }
               const color = chalk.keyword(colorName);

               // custom format, manual pretty-printing
               // 14:27:01 - [response] GET /error/400 400
               const message = `${now} - [${data.event}] ${data.method.toUpperCase()} ${data.path} ${color(data.statusCode)} \n`
               return next(null, message);
            }

            if (data.event === 'ops' && logServerState) {
               // Original library format (but time)
               // 210502/124403.691, [ops] memory: 65Mb, uptime (seconds): 5.417715824, load: [0.9208984375,1.36669921875,1.20654296875]
               const message = `${now}: [${data.event}] memory: ${ Math.trunc(data.proc.mem.rss / (1024 * 1024)) }Mb, uptime (seconds): ${data.proc.uptime}, load: [${data.os.load.join()}] \n`

               return next(null, message);
            }

            next(null);
         }
      }

      goodOptions.reporters = {
         myReporter: [
            new aLogTransformer(),
            'stdout'
         ]
      }

   }


   await server.register({
      plugin: require('@hapi/good'),
      options: goodOptions
   });


}


const registerLoggingWithLaabr = async (server) => {

   let logUsingLaabr;

   if (process.env.LOG_REQUEST_MESSAGE_LAABR === 'yes') {
      logUsingLaabr = true;
   }

   const loggingOptions = {
      formats: {onPostStart: ':time :start :level :message'},
      tokens: {start: () => '[start]'},
      indent: 0,
      colored: true
   };

   if (logUsingLaabr) {
      await server.register({
         plugin: require('laabr'),
         options: loggingOptions,
      });
   }

};


const registerCustomEvents = (server) => {
   server.event(customEvent);
   server.events.on(customEvent, (update) => console.log(`custom event ${customEvent} received, got: ${update} (logged by console.log)`));
}

const registerNativeEvents = (server) => {

   // a server-related event
   server.events.on('start', () => {
      console.log("Server started (got 'start' event, logged by console.log)");
   });

   // a request-related event
   server.events.on('response', (request) => {
      console.log(`Response sent for request on ${request.path} (got 'response' event, logged by console.log)`);
   });

   // a message-related event
   server.events.on('log', (message) => {

      const formattedMessage= `[${message.tags[0]}] ${message.data} (got 'log' event)`;

      if(logBunyan){

         const logLevels = {
            TRACE: 'trace',
            DEBUG: 'debug',
            INFO: 'info',
            WARN: 'warn',
            ERROR: 'error',
            FATAL: 'fatal'
         }
         const defaultLogLevel = logLevels.TRACE;
         const logger = bunyan.createLogger({name: "hapi", level: defaultLogLevel});

         logger.info(formattedMessage + '(logged by bunyan)');
      } else {
         console.log(formattedMessage + '(logged by console.log)');
      }
   });

}


module.exports = {initialize, start};
