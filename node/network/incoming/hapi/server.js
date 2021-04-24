require('dotenv').config();
const Hapi = require('@hapi/hapi');

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

   await server.start();

   // console.log(`Server running at: ${server.info.uri}`);

   return server;
};

const createServer = function () {
   return Hapi.server({
      port: 3000,
      host: 'localhost'
   });
}

const registerRoutes = function (server) {
   const routes = [{
      method: 'GET',
      path: '/',
      handler: function () {
         return 'Hello World!';
      }
   }, {
      method: 'GET',
      path: '/foo',
      config: {
         auth: false,
         handler: function () {
            return 'bar';
         }
      }
   },
      {
         method: 'GET',
         path: '/throw-error',
         config: {
            auth: false,
            handler: function () {
               throw new Error('OMG, something bad happened!');
            }
         }
      }];

   server.route(routes);

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
      healthCheck: async function(server) {
         //throw new Error('Server not healthy');
         return true;
      }
   };

   await server.register({
      plugin: require('hapi-alive'),
      options: healthcheckOptions
   });

}

module.exports = {initialize, start};
