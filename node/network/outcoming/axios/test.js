const axios = require('axios');
const axiosRetry = require('axios-retry');

const { StatusCodes } = require('http-status-codes');
require('chai').should();
const nock = require('nock');
const baseUrl = 'http://localhost';

describe('axios', () => {

   describe('get', () => {
      it('should make call', async () => {
         // given
         const endpoint = '/bar';
         const nockGET = nock(baseUrl)
            .get(endpoint)
            .reply(StatusCodes.OK);

         // when
         const url = baseUrl + endpoint;
         const response = await axios.get(url);

         // then
         response.status.should.equal(StatusCodes.OK);
         nockGET.isDone().should.be.true;
      });
      describe('should use config', () => {

         it('baseUrl', async () => {
            // given
            const endpoint = '/bar';
            const nockGET = nock(baseUrl)
               .get(endpoint)
               .reply(StatusCodes.OK);

            // when
            const config = { baseURL: baseUrl };
            const response = await axios.get(endpoint, config);

            // then
            response.status.should.equal(StatusCodes.OK);
            nockGET.isDone().should.be.true;
         });

         it('headers', async () => {
            // given
            const endpoint = '/bar';

            const apiKey = 'test-api-key';

            const customHeader = {
               name: 'X-foo',
               value: 'bar'
            };

            const nockGET = nock(baseUrl)
               .get(endpoint)
               .matchHeader('Authorization', `Bearer ${apiKey}`)
               .matchHeader(customHeader.name, customHeader.value)
               .reply(StatusCodes.OK);

            // when
            const authorizationHeader = { Authorization: `Bearer ${apiKey}` };
            const flattenedCustomHeader = { 'X-foo': 'bar' };
            const headers = { ...authorizationHeader, ...flattenedCustomHeader };
            // single header
            // const headers = {Authorization: `Bearer ${apiKey}`},
            // multiple headers
            // const headers = {
            //    Authorization: `Bearer ${apiKey}`
            //    'X-foo': 'bar'
            // };
            const config = {
               baseURL: baseUrl,
               headers
            };
            const response = await axios.get(endpoint, config);

            // then
            response.status.should.equal(StatusCodes.OK);
            nockGET.isDone().should.be.true;
         });
      });
   });

   describe('post', () => {
      it('should make call', async () => {
         // given
         const baseUrl = 'http://localhost';
         const endpoint = '/bar';
         const stub = nock(baseUrl)
            .post(endpoint)
            .reply(StatusCodes.OK);

         // when
         const url = baseUrl + endpoint;
         const response = await axios.post(url);

         // then
         response.status.should.equal(StatusCodes.OK);
         stub.isDone().should.be.true;
      });
   });

   context('if endpoint does not exist', () => {
      it('should throw an error ', async () => {
         // given
         const endpoint = '/non-existing-endpoint';

         // when
         let actualError;
         const url = 'https://fakestoreapi.com/' + endpoint;
         try {
            await axios.get(url);
         } catch (error) {
            actualError = error;
         }

         // then
         actualError.code.should.equal('ERR_BAD_REQUEST');
         actualError.message.should.equal('Request failed with status code 404');
      });
   });

   context('when the response is delayed', () => {
      it('should throw an error if exceeding timeout', async () => {
         // given
         const endpoint = '/bar';
         const config = { timeout: 1 };
         nock(baseUrl)
            .get(endpoint)
            .delay(2)
            .reply(StatusCodes.OK);

         let catchedError;

         // when
         const url = baseUrl + endpoint;
         try {
            await axios.get(url, config);
         } catch (error) {
            catchedError = error;
         }

         // then
         catchedError.message.should.equal('timeout of 1ms exceeded');
      });
      it('should respond 200_OK if response came after a VERY long time', async function() {
         // given

         // can be tested in a cleaner way
         // https://javascript.plainenglish.io/how-to-add-a-timeout-limit-to-asynchronous-javascript-functions-3676d89c186d

         this.timeout(3000);
         const endpoint = '/bar';
         nock(baseUrl)
            .get(endpoint)
            .delay(2500)
            .reply(StatusCodes.OK);

         // when
         const url = baseUrl + endpoint;
         const response = await axios.get(url);

         // then
         response.status.should.equal(StatusCodes.OK);
      });
      it('should respond 200_OK when not reaching timeout', async () => {
         // given
         const endpoint = '/bar';
         const config = { timeout: 2 };
         const nockGET = nock(baseUrl)
            .get(endpoint)
            .delay(1)
            .reply(StatusCodes.OK);

         // when
         const url = baseUrl + endpoint;
         const response = await axios.get(url);

         // then
         response.status.should.equal(StatusCodes.OK);
      });
   });

   describe('keep-alive', () => {
      it('should open socket keep-alive', async function() {
         this.timeout(100000);
         const waitForThatMilliseconds = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
         const { Agent } = require('https');

         // given
         const keepAlive = false;
         const axiosInstance = axios.create({
            httpsAgent: new Agent({ keepAlive })
         });

         // check open sockets with ss --tcp --all --options --resolve
         for (let i = 0; i < 10; i++) {
            console.time(i);
            const response = await axiosInstance.get('https://fakestoreapi.com/products');
            console.timeEnd(i);
            // response.data.should.not.be.an.empty.array;
            response.status.should.equal(StatusCodes.OK);
            await waitForThatMilliseconds(1000);
         }

      });
   });

   describe('retry', () => {
      // https://github.com/softonic/axios-retry
      it.skip('should succeed on second call, but does not (bug)', async () => {
         // given
         // axiosRetry(axios, { retries: 1 });
         const endpoint = '/bar';
         // https://stackoverflow.com/questions/31547758/node-js-nock-simulate-request-timeout-and-subsequent-success
         const nockGET = nock(baseUrl)
            .get(endpoint)
            .replyWithError('something awful happened');
         // .get(endpoint)
         // .reply(StatusCodes.OK);

         // when
         const url = baseUrl + endpoint;
         const response = await axios.get(url);

         // then
         response.status.should.equal(StatusCodes.OK);
         nockGET.isDone().should.be.true;
      });

   });
});
