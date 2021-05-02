const {StatusCodes} = require('http-status-codes');
const Joi = require('joi');

const handleError = function (request, h, err) {

   if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
      const invalidItem = err.details[0];
      return h.response(`Data Validation Error. Schema violation. <${invalidItem.path}> \nDetails: ${JSON.stringify(err.details)}`)
         .code(400)
         .takeover();
   }

   return h.response(err)
      .takeover()
};

const routes = [{
   method: 'GET',
   path: '/',
   handler: function () {
      return 'Hello World!';
   }
}, {
   method: 'POST',
   path: '/payload',
   config: {
      auth: false,
      validate: {
         payload: Joi.object({
            id: Joi.number().integer().required(),
            name: Joi.string().required(),
         }),
         // failAction: (request, h) => {
         //    return h.response(`Data Validation Error. Schema violation. <${invalidItem.path}> \nDetails: ${JSON.stringify(err.details)}`)
         //       .code(400)
         //       .takeover();
         // },
         //handleError
      },
      handler: function (request) {
         return `You sent ${JSON.stringify(request.payload)}`;
      },
   }
},
   {
      method: 'GET',
      path: '/json',
      config: {
         auth: false,
         handler: function () {
            return {hello: 'world'};
         }
      }
   },
   {
      method: 'GET',
      path: '/hello/{name}',
      config: {
         auth: false,
         validate: {
            params: Joi.object({
               name: Joi.required(),
            }),
         },
         handler: async function (request) {
            request.server.log(['tag'], 'a message logged by /foo (logged by server.log())');
            await request.server.events.emit('custom-event', 'emitted in /foo route');
            return `Hello ${request.params.id}`;
         }
      }
   },
   {
      method: 'GET',
      path: '/error/404',
      config: {
         auth: false,
         handler: function (request, h) {
            const response = h.response('I am a faked 404');
            response.code(StatusCodes.NOT_FOUND);
            return response;
         }
      }
   },
   {
      method: 'GET',
      path: '/error/400',
      config: {
         auth: false,
         handler: function (request, h) {
            const response = h.response('I am a faked 400');
            response.code(StatusCodes.BAD_REQUEST);
            return response;
         }
      }
   },
   {
      method: 'GET',
      path: '/error/500',
      config: {
         auth: false,
         handler: function (request, h) {
            const response = h.response('I am a faked 500');
            response.code(StatusCodes.INTERNAL_SERVER_ERROR);
            return response;
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
