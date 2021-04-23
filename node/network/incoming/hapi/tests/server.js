const Hapi = require('@hapi/hapi');

const server = Hapi.server({
   port: 3000,
   host: 'localhost'
});

const routes = [{
   method: 'GET',
   path: '/',
   handler: function () {
      return 'Hello World!';
   }
},{
   method: 'GET',
   path: '/foo',
   config: {
      auth: false,
      handler: function () {
         return 'bar';
      }
   }
}];

server.route(routes);

process.on('unhandledRejection', (err) => {
   console.log(err);
   process.exit(1);
});

const init = async () => {
   await server.initialize();
   return server;
};

const start = async () => {
   await server.start();
   console.log(`Server running at: ${server.info.uri}`);
   return server;
};

module.exports = { init, start };
