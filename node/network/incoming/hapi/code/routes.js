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
      handler: function (request) {
         request.server.log(['tag'], 'a message logged by /foo');
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
