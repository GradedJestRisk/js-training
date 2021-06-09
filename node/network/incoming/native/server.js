'use strict'

const { createServer } = require('http')
const server = createServer().listen(parseInt(process.env.PORT) || 3000)

server.on('request', (request, response) => {
   if (request.url === '/') {
      response.end(JSON.stringify({ foo: 'bar' }))
   } else if (request.url === '/fail') {
      response.destroy()
   }
})
