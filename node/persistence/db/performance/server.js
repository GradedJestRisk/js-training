const Hapi = require('@hapi/hapi');
const routesConfiguration = require('./code/routes');
const repository = require('./code/repository');
const crypto = require('crypto');
const {trace} = require('./code/request');
const {knexMonitoring} = require('./database/database-client');
const applicationPackage = require('./package');

const init = async () => {

   const server = Hapi.server({
      port: 3000,
      host: 'localhost'
   });

   server.route(routesConfiguration);

   await server.register({ plugin: require('blipp'), options: {showAuth: true} });

   const loggingOptions = {
      formats: {
         onPostStart: ':time[utc] :start :level :message',
         response: ':time[utc] :method :url :status :payload (:responseTime ms)'
      },
      tokens: {start: () => '[start]'},
      indent: 0,
      colored: true
   };

   await server.register({
      plugin: require('laabr'),
      options: loggingOptions,
   });

   await repository.insertRoutes(server.table());
   await repository.insertVersion(applicationPackage.version);

   server.ext('onPreHandler', async function(request, h){
      const correlationId = request.headers['x-correlation-id']
      const routeText = `${request.method} ${request.path}`;
      const routeId = crypto.createHash('sha1').update(routeText).digest('hex');
      const requestId =  crypto.createHash('sha1').update(request.info.id).digest('hex');
      await trace({knexMonitoring, routeId, requestId, correlationId, version: applicationPackage.version});
      request.requestId = requestId;
      return h.continue;
   });

   // server.ext('onRequest', function (request, reply) {
   //    console.log(request.method.toUpperCase() + ' ' + request.path);
   //    return reply.continue;
   // });

   await server.start();
   console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
   console.log(err);
   process.exit(1);
});

init();
