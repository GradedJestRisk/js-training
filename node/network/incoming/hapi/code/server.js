require('dotenv').config();
const Hapi = require('@hapi/hapi');
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

   const sentryOptions = {
      client: {dsn: process.env.SENTRY_DSN},
   }

   await server.register({
      plugin: require('hapi-sentry'),
      options: sentryOptions,
   });

   const loggingOptions = {
      formats: {onPostStart: ':time :start :level :message'},
      tokens: {start: () => '[start]'},
      indent: 0,
      colored: true
   };

   await server.register({
      plugin: require('laabr'),
      options: loggingOptions,
   });

   const blippOptions = {};
   await server.register({
      plugin: require('blipp'),
      options: blippOptions
   });

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

   const eachFiveSecond = 5 * 1000;
   const goodMonitoringOptions = {
      ops: {
         interval: eachFiveSecond
      },
      reporters: {
         myConsoleReporter: [
            {
               module: '@hapi/good-console'
            },
            'stdout'
         ]
      }
   }

   if (process.env.LOG_SERVER_STATE === 'yes') {
      await server.register({
         plugin: require('@hapi/good'),
         options: goodMonitoringOptions
      });
   }

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

const registerCustomEvents = (server) => {
   server.event(customEvent);
   server.events.on(customEvent, (update) => console.log(`custom event ${customEvent} received, got: ${update}`));
}


const registerNativeEvents = (server) => {

   // a server-related event
   server.events.on('start', () => {
      console.log('Server started');
   });

   // a request-related event
   server.events.on('response', (request) => {
      console.log(`Response sent for request on ${request.path}`);
   });
}


module.exports = {initialize, start};
