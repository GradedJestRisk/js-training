function sleep ({ seconds }) {
   return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function rollDice () {
   return Math.floor(Math.random() * 6);
}

const routes = [{
   method: 'GET',
   path: '/',
   handler: function() {
      return 'Hello World!';
   }
}, {
   method: 'GET',
   path: '/foo',
   config: {
      auth: false,
      handler: async function(request, reply) {
         if (process.env.ENABLE_LOGGING === 'yes') {
            request.server.log(['route'], 'a message logged by /foo');
         }
         if (process.env.DELAY_RESPONSE) {
            await sleep({ seconds: 1 });
         }
         if (rollDice() === 1) {
            // return reply(Boom.unauthorized('Auth server is down'));
            throw new Error('OMG, something bad happened!');
         } else {
            return 'bar';
         }

      }
   }
},
   {
      method: 'GET',
      path: '/throw-error',
      config: {
         auth: false,
         handler: function() {
            throw new Error('OMG, something bad happened!');
         }
      }
   },
   {
      method: 'GET',
      path: '/reject-promise',
      config: {
         auth: false,
         handler: async function() {
            return Promise.reject(new Error('OMG, something bad happened!'));
         }
      }
   }
];

module.exports = routes;
