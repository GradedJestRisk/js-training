const axios = require('axios');

const {StatusCodes} = require('http-status-codes');
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

      describe('should use config', () => {

         it('baseUrl', async () => {
            // given
            const baseURL = 'http://localhost';
            const endpoint = '/bar';
            const nockGET = nock(baseURL)
               .get(endpoint)
               .reply(StatusCodes.OK);

            // when
            const config = {baseURL};
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

            const customHeader = { name: 'X-foo', value : 'bar' };

            const nockGET = nock(baseURL)
               .get(endpoint)
               .matchHeader('Authorization', `Bearer ${apiKey}`)
               .matchHeader(customHeader.name, customHeader.value)
               .reply(StatusCodes.OK);

            // when
            const authorizationHeader = {Authorization: `Bearer ${apiKey}`};
            const flattenedCustomHeader = { 'X-foo' : 'bar' };
            const headers = { ...authorizationHeader, ...flattenedCustomHeader};
            // single header
            // const headers = {Authorization: `Bearer ${apiKey}`},
            // multiple headers
            // const headers = {
            //    Authorization: `Bearer ${apiKey}`
            //    'X-foo': 'bar'
            // };
            const config = {baseURL, headers};
            const response = await axios.get(endpoint, config);

            // then
            response.status.should.equal(StatusCodes.OK);
            nockGET.isDone().should.be.true;
         });
      });

   });
});
