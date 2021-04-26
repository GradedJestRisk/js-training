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
      handler: async function (request) {
         request.server.log(['tag'], 'a message logged by /foo');
         request.server.log(['tag'], 'another message logged by /foo');
         await request.server.events.emit('custom-event', 'emitted in /foo route');
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
   },
   {
      method: 'GET',
      path: '/reject-promise',
      config: {
         auth: false,
         handler: async function () {
            return Promise.reject(new Error('OMG, something bad happened!'));
         }
      }
   },
];


module.exports = routes;
