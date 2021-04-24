const { expect } = require('chai');
const testServer = require('../server');

// https://hapi.dev/tutorials/testing/?lang=en_US
describe('Test', ()=>{

   let server;

   before(async () => {
      server = await testServer.initialize();
   });

   describe('a route', ()=>{

      it('responds with 200', async () => {
         const response = await server.inject({
            method: 'get',
            url: '/'
         });
         expect(response.statusCode).to.equal(200);
      });

      it('return a message', async () => {
         const response = await server.inject({
            method: 'get',
            url: '/'
         });
         expect(response.payload).to.equal('Hello World!');
      });

   });

   describe('a unauthenticated route', ()=>{

      it('responds with 200', async () => {
         const request = {
            method: 'get',
            url: '/foo'
         }

         const response = await server.inject(request);

         expect(response.statusCode).to.equal(200);
      });

      it('return a message', async () => {
         const request = {
            method: 'get',
            url: '/foo'
         }

         const response = await server.inject(request);

         expect(response.payload).to.equal('bar');
      });

   });

});
