#!/usr/bin/env node
'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

   const server = Hapi.server({
      port: 3000,
      host: 'localhost'
   });

   server.route({
      method: 'GET',
      path: '/',
      config: {
         description: 'return "Hello, world!"'
      },
      handler: function () {
         console.log('GET on /')
         return 'Hello, world!'
      }
   });

   await server.start();
   console.log('Server running on %s', server.info.uri);
   // process.exit(0);
};

process.on('unhandledRejection', (err) => {
   console.log(err);
   process.exit(1);
});

init();
