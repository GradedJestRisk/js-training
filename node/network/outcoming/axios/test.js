const axios = require('axios');

const { StatusCodes } = require('http-status-codes');
require('chai').should();
const nock = require('nock');

describe('axios', () => {

   describe('get', () => {

      it('should make call', async () => {
         // given
         const baseUrl = 'http://localhost';
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

      describe('timeout', () => {
         it('should respond 200_OK if response came after a VERY long time', async function() {
            // given

            // can be tested in a cleaner way
            // https://javascript.plainenglish.io/how-to-add-a-timeout-limit-to-asynchronous-javascript-functions-3676d89c186d
            
            this.timeout(3000);
            const baseUrl = 'http://localhost';
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
            const baseUrl = 'http://localhost';
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

         it('should throw an error if exceeding timeout', async () => {
            // given
            const baseUrl = 'http://localhost';
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
      });

      describe('should use config', () => {

         it('baseUrl', async () => {
            // given
            const baseURL = 'http://localhost';
            const endpoint = '/bar';
            const nockGET = nock(baseURL)
               .get(endpoint)
               .reply(StatusCodes.OK);

            // when
            const config = { baseURL };
            const response = await axios.get(endpoint, config);

            // then
            response.status.should.equal(StatusCodes.OK);
            nockGET.isDone().should.be.true;
         });

         it('headers', async () => {
            // given
            const baseURL = 'http://localhost';
            const endpoint = '/bar';

            const apiKey = 'test-api-key';

            const customHeader = {
               name: 'X-foo',
               value: 'bar'
            };

            const nockGET = nock(baseURL)
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
               baseURL,
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
});
