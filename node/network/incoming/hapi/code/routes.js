const { StatusCodes } = require('http-status-codes')
const Joi = require('joi')

const handleError = function (request, h, err) {

   if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
      const invalidItem = err.details[0]
      return h.response(`Data Validation Error. Schema violation. <${invalidItem.path}> \nDetails: ${JSON.stringify(err.details)}`)
         .code(400)
         .takeover()
   }

   return h.response(err)
      .takeover()
}

const routes = [
   {
      method: 'GET',
      path: '/',
      config: {
         description: 'return "Hello, world!"'
      },
      handler: function () {
         return 'Hello, world!'
      }
   }, {
      method: 'POST',
      path: '/payload',
      config: {
         description: 'validate payload and return it',
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
            return `You sent ${JSON.stringify(request.payload)}`
         },
      }
   },
   {
      method: 'GET',
      path: '/json',
      config: {
         description: 'return single object in JSON',
         handler: function () {
            return { hello: 'world' }
         }
      }
   },
   {
      method: 'GET',
      path: '/hello/{name}',
      config: {
         description: 'validate a string param',
         validate: {
            params: Joi.object({
               name: Joi.string().required(),
            }),
         },
         handler: async function (request) {
            request.server.log(['tag'], 'a message logged by /foo (logged by server.log())')
            await request.server.events.emit('custom-event', 'emitted in /foo route')
            return `Hello ${request.params.name}`
         }
      }
   },
   {
      method: 'GET',
      path: '/you/{peopleId}',
      config: {
         description: 'validate integer payload and return its type',
         validate: {
            params: Joi.object({
               peopleId: Joi.number().integer().min(1).required(),
            }),
         },
         handler: async function (request) {
            const peopleId = request.params.peopleId
            request.server.log(['tag'], 'a message logged by /you (logged by request.server.log())')
            return `peopleId type is ${typeof peopleId}`
         }
      }
   },
   {
      method: 'GET',
      path: '/error/404',
      config: {
         description: 'return HTTP 404',
         handler: function (request, h) {
            const response = h.response('I am a faked 404')
            response.code(StatusCodes.NOT_FOUND)
            return response
         }
      }
   },
   {
      method: 'GET',
      path: '/error/400',
      config: {
         description: 'return HTTP 400',
         handler: function (request, h) {
            const response = h.response('I am a faked 400')
            response.code(StatusCodes.BAD_REQUEST)
            return response
         }
      }
   },
   {
      method: 'GET',
      path: '/error/500',
      config: {
         description: 'return HTTP 500',
         handler: function (request, h) {
            const response = h.response('I am a faked 500')
            response.code(StatusCodes.INTERNAL_SERVER_ERROR)
            return response
         }
      }
   },
   {
      method: 'GET',
      path: '/error/throw',
      config: {
         description: 'throw new Error()',
         handler: function () {
            throw new Error('OMG, something bad happened!')
         }
      }
   },
   {
      method: 'GET',
      path: '/reject-promise',
      config: {
         description: 'Promise.reject()',
         handler: async function () {
            return Promise.reject(new Error('OMG, something bad happened!'))
         }
      }
   },
]

module.exports = routes
