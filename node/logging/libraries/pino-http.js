'use strict'

const http = require('http')
const server = http.createServer(handle)

const logger = require('pino-http')()

function handle (req, res) {
   logger(req, res)
   req.log.info('something else')
   res.end('hello world')
}

console.log('Hit curl localhost:3000/ to get logs')

server.listen(3000)
