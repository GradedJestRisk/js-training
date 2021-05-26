const { expect } = require('chai');
const testServer = require('../code/server');

// https://hapi.dev/tutorials/testing/?lang=en_US
describe('Routing', ()=>{

   let server;

   before(async () => {
      server = await testServer.initialize();
   });

   describe('response code', ()=> {
      it('responds with 200 if no response code is given', async () => {
         const response = await server.inject({
            method: 'get',
            url: '/'
         });
         expect(response.statusCode).to.equal(200);
      });
      it('responds with a response code if one given', async () => {
         const response = await server.inject({
            method: 'get',
            url: '/error/404'
         });
         expect(response.statusCode).to.equal(404);
      });
      it('responds with an internal error if an error is thrown, but stack is not exposed', async () => {
         const response = await server.inject({
            method: 'get',
            url: '/error/throw'
         });
         expect(response.statusCode).to.equal(500);
         expect(response.statusMessage).to.equal('Internal Server Error');
      });
   });

   describe('incoming data validation', ()=>{

      it('rejects invalid data', async () => {
         const response = await server.inject({
            method: 'get',
            url: '/hello/foo',
         });
         expect(response.statusCode).to.equal(400);
         expect(response.statusMessage).to.equal('Bad Request');
         expect(response.result.message).to.equal('Invalid request params input');
      });

      it('accept and parse valid data', async () => {
         const response = await server.inject({
            method: 'get',
            url: '/you/23'
         });
         expect(response.statusCode).to.equal(200);
         expect(response.payload).to.equal('peopleId type is number');
      });

   });


});
