require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Oppsy = require('@hapi/oppsy')

const routesConfiguration = require('./routes')

// Initializes the server (starts the caches, finalizes plugin registration)
// but does not start listening on the connection port.
const initialize = async () => {

   const server = createServer()

   registerRoutes(server)

   await enableLogging(server)

   await enableMonitoring(server)

   await server.initialize()

   return server
}

const start = async () => {

   const server = createServer()

   registerRoutes(server)

   await enableLogging(server)

   //await enableMonitoring(server);

   await server.start()

   return server
}

const createServer = function () {
   return Hapi.server({
      port: 3000,
      host: 'localhost'
   })
}

const registerRoutes = function (server) {
   server.route(routesConfiguration)
}

const enableLogging = async function (server) {

   if (process.env.LOGGING_LIBRARY === 'HAPI-PINO') {

      let ignoredEventTags = []

      if (process.env.NODE_ENV === 'development') {
         ignoredEventTags = {
            log: ['ops'],
         }
      }

      // check https://github.com/pinojs/hapi-pino#optionsserializers--key-string-pinoserializerfn
      // to skip headers
      const loggingOptions = {
         prettyPrint: true,
         ignoredEventTags,
         logRequestComplete: process.env.LOG_REQUEST === 'true',
         logQueryParams: process.env.LOG_QUERY_PARAMS === 'true',
         logPayload: process.env.LOG_PAYLOAD === 'true',
         serializers: {
            req: (request) => {
               return {
                  ...request,
                  'foo': 'bar'
               }
            },
            res: (response) => {
               return {
                  ...response,
                  'bar': 'foo'
               }
            },
            responseTime: (duration) => {
               return {
                  duration,
                  startedAt: new Date(new Date() - duration).toUTCString()
               }
            }
         },
      }

      // const pino = require('pino')
      // const pretty = require('pino-pretty')
      // const omitDay = 'HH:MM:ss'
      // const prettier = pretty({
      //    sync: true,
      //    colorize: true,
      //    translateTime: omitDay,
      //    ignore: 'pid,hostname',
      // })
      //
      // const logger = pino(
      //    prettier
      // )

      await server.register({
         plugin: require('hapi-pino'),
         options: loggingOptions,
         //instance: logger,
      })

   } else if (process.env.LOGGING_LIBRARY === 'LAABR') {

      const loggingOptions = {
         formats: { onPostStart: ':time :start :level :message' },
         tokens: { start: () => '[start]' },
         indent: 0,
         colored: true
      }

      await server.register({
         plugin: require('laabr'),
         options: loggingOptions,
      })

   } else {
      console.error('LOGGING_LIBRARY should be any of HAPI-PINO/LAABR, but was ' + process.env.LOGGING_LIBRARY)
      process.exit(1)
   }

}

const enableMonitoring = async function (server) {

   if (process.env.ENABLE_MONITORING === 'yes') {

      const oppsy = new Oppsy(server)

      oppsy.on('ops', (data) => {
         server.log(['ops'], data)
      })

      const emitEachFiveSeconds = 5 * 1000
      oppsy.start(emitEachFiveSeconds)

   }

}

module.exports = {
   initialize,
   start
}
