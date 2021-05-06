const Hapi = require('@hapi/hapi');
const routesConfiguration = require('./code/routes');

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

   await server.start();
   console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
   console.log(err);
   process.exit(1);
});

init();
