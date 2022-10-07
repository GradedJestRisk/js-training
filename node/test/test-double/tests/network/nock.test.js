const axios = require('axios');
const chai = require('chai');
const nockTest = require('nock');

const expect = chai.expect;
chai.should();

describe('should intercept and reply to http calls', async () => {
   describe('on httpbin.org', async () => {
      it('disableNetConnect() throws an error on any call', async () => {
         let response;
         const baseUrl = 'https://httpbin.org';
         const route = '/get';

         nockTest.disableNetConnect();

         // when
         try {
            await axios.get(baseUrl + route);
         } catch (nockError) {
            error = nockError;
         }

         // then
         expect(error.code).to.equal('ENETUNREACH');
         expect(error.message).to.equal(
            'Nock: Disallowed net connect for "httpbin.org:443/get"'
         );
         expect(error.config.method).to.equal('get');
         expect(error.config.url).to.equal(baseUrl + route);
      });

      it('on first call', async () => {
         let response;
         const baseUrl = 'https://httpbin.org';
         const route = '/get';

         const OK_RESPONSE_STATUS = 200;

         const remoteAPICall = nockTest(baseUrl)
            .get(route)
            .reply(OK_RESPONSE_STATUS, {});

         // when
         response = await axios.get(baseUrl + route);

         // then
         response.status.should.equal(OK_RESPONSE_STATUS);
         remoteAPICall.isDone().should.be.true;
      });

      it('throw error on second call', async () => {
         let error;
         const baseUrl = 'https://httpbin.org';
         const route = '/get';

         const OK_RESPONSE_STATUS = 200;

         nockTest(baseUrl).get(route).reply(OK_RESPONSE_STATUS, {});

         await axios.get(baseUrl + route);

         // when
         try {
            await axios.get(baseUrl + route);
         } catch (nockError) {
            error = nockError;
         }

         // then
         expect(error.code).to.equal('ERR_NOCK_NO_MATCH');
         expect(error.status).to.equal(404);
         expect(error.config.method).to.equal('get');
         expect(error.config.url).to.equal(baseUrl + route);
      });

      it('isDone() should be false if expected call dit not occurred', async () => {
         let response;
         const baseUrl = 'https://httpbin.org';
         const route = '/get';

         const OK_RESPONSE_STATUS = 200;

         const remoteAPICall = nockTest(baseUrl)
            .get(route)
            .reply(OK_RESPONSE_STATUS, {});

         // when

         // then
         remoteAPICall.isDone().should.be.false;
         expect(nockTest.pendingMocks()).to.deep.equal([
            'GET https://httpbin.org:443/get',
         ]);
      });
   });

   describe('on external API', async () => {
      it('to valid URL', async () => {
         const SibApiV3Sdk = require('sib-api-v3-sdk');
         const api = new SibApiV3Sdk.AccountApi();

         const baseUrl = 'https://api.sendinblue.com';
         const route = '/v3/account';

         const OK_RESPONSE_STATUS = 200;

         const mailjetCall = nockTest(baseUrl)
            .get(route)
            .reply(OK_RESPONSE_STATUS, {});

         await api.getAccount();

         // then
         mailjetCall.isDone().should.be.true;
      });
   });
});

describe('unmocked call', async () => {
   it.skip('to valid URL can be sniffed', async () => {
      // monkey-patch
      // https://chatbotsmagazine.com/track-outgoing-http-s-requests-in-nodejs-48608553f03c
      // monkey-patch
      const http = require('http');
      // store a reference to the original request function
      const originalRequest = http.request;
      // override the function
      http.request = function wrapMethodRequest(req) {
         console.log('outgoing http request ');
         console.log(req.host, req.body);
         // call the original 'request' function
         return originalRequest.apply(this, arguments);
      };
   });

   it('to valid URL', async () => {
      let response;
      const baseUrl = 'https://httpbin.org';
      const route = '/get';
      const url = baseUrl + route;
      const OK_RESPONSE_STATUS = 200;

      // when
      response = await axios.get(url);

      // then
      response.status.should.equal(OK_RESPONSE_STATUS);
   });

   it('to invalid URL', async () => {
      let response;
      const baseUrl = 'https://httpbin.org';
      const route = '/foo';
      const url = baseUrl + route;
      const NOT_FOUND_RESPONSE_STATUS = 404;

      // when
      try {
         await axios.get(url);
      } catch (error) {
         response = error.response;
      }

      // then
      response.status.should.equal(NOT_FOUND_RESPONSE_STATUS);
   });
});
