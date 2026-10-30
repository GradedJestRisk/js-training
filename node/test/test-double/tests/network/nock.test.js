const axios = require('axios');
const chai = require('chai');
const nock = require('nock');
const { StatusCodes } = require('http-status-codes');

const expect = chai.expect;
chai.should();

describe('nock', function () {
   describe('should intercept and reply to http calls', async () => {
      describe('made by axios', async () => {
         describe('nominal case', function () {
            describe('if the URL, payload and headers are mocked', function () {
               describe('and a single call is done', function () {
                  it('the mock respond', async () => {
                     let response;
                     const baseUrl = 'https://httpbin.org';
                     const route = '/get';

                     nock(baseUrl).get(route).reply(StatusCodes.OK, {});

                     // when
                     response = await axios.get(baseUrl + route);

                     // then
                     response.status.should.equal(StatusCodes.OK);
                  });
               });
            });
         });

         describe('error case', function () {
            describe('if the URL, payload and headers are mocked', function () {
               describe('and two call are done', function () {
                  it('throw error on second call', async () => {
                     let error;
                     const baseUrl = 'https://httpbin.org';
                     const route = '/get';

                     const OK_RESPONSE_STATUS = 200;

                     nock(baseUrl).get(route).reply(OK_RESPONSE_STATUS, {});

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
               });
            });
            describe('if the expected call dit not occurred', function () {
               it('isDone() should be false ', async () => {
                  let response;
                  const baseUrl = 'https://httpbin.org';
                  const route = '/get';

                  const OK_RESPONSE_STATUS = 200;

                  const remoteAPICall = nock(baseUrl)
                     .get(route)
                     .reply(OK_RESPONSE_STATUS, {});

                  // when

                  // then
                  remoteAPICall.isDone().should.be.false;
                  expect(nock.pendingMocks()).to.deep.equal([
                     'GET https://httpbin.org:443/get',
                  ]);
               });
            });

            describe('if an unmocked request is done', function () {
               describe('and disableNetConnect is active', function () {
                  it('an error is thrown', async () => {
                     const baseUrl = 'https://httpbin.org';
                     const route = '/get';

                     nock.disableNetConnect();

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
               });
            });

            describe('if the base URL is mocked but the route does not match', function () {
               it('it will return NOT_FOUND (404)', async () => {
                  const baseUrl = 'http://localhost:3000/api';
                  const mockedRoute = '/healthcheck';
                  const calledRoute = '/probes';
                  const calledUrl = `${baseUrl}${calledRoute}`;
                  nock(baseUrl).get(mockedRoute).reply(StatusCodes.OK);

                  // when
                  let actual;
                  try {
                     await axios.get(calledUrl);
                  } catch (error) {
                     actual = error;
                  }

                  // then
                  actual.status.should.equal(StatusCodes.NOT_FOUND);
                  actual.code.should.equal('ERR_NOCK_NO_MATCH');
               });
            });

            describe('If the URL is mocked but the payload does not match', function () {
               it('it will return NOT_FOUND (404)', async () => {
                  const baseUrl = 'http://localhost:3000/api';
                  const route = '/healthcheck';
                  const url = `${baseUrl}${route}`;
                  nock(baseUrl)
                     .put(route, { name: 'Dorothy' })
                     .reply(StatusCodes.OK);

                  // when
                  let actual;
                  try {
                     await axios.put(url, { name: 'Jack' });
                  } catch (error) {
                     actual = error;
                  }

                  // then
                  actual.status.should.equal(StatusCodes.NOT_FOUND);
                  actual.code.should.equal('ERR_NOCK_NO_MATCH');
               });
            });

            describe('If the URL is mocked, the payload match, but not the headers', function () {
               this.retries(2);
               it('it will return NOT_FOUND (404)', async () => {
                  const baseUrl = 'http://localhost:3000/api';
                  const route = '/healthcheck';
                  const url = `${baseUrl}${route}`;
                  nock(baseUrl, {
                     reqheaders: {
                        'Content-Type': 'application/json',
                     },
                  })
                     .put(route, { name: 'Dorothy' })
                     .reply(StatusCodes.OK);

                  // when
                  let response;
                  let actual;
                  try {
                     response = await axios.put(
                        url,
                        { name: 'Dorothy' },
                        {
                           headers: {
                              'Content-Type': 'text/javascript; charset=utf-8',
                           },
                        }
                     );
                  } catch (error) {
                     actual = error;
                  }

                  // then
                  actual.status.should.equal(StatusCodes.NOT_FOUND);
                  actual.code.should.equal('ERR_NOCK_NO_MATCH');
               });
            });
         });
      });

      describe('made by a dependency', async () => {
         it('to valid URL', async () => {
            const SibApiV3Sdk = require('sib-api-v3-sdk');
            const api = new SibApiV3Sdk.AccountApi();

            const baseUrl = 'https://api.sendinblue.com';
            const route = '/v3/account';

            const OK_RESPONSE_STATUS = 200;

            const mailjetCall = nock(baseUrl)
               .get(route)
               .reply(OK_RESPONSE_STATUS, {});

            await api.getAccount();

            // then
            mailjetCall.isDone().should.be.true;
         });
      });
   });

   describe('calling URL without double (un-nocked)', async () => {
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

      describe('to valid URL', function () {
         it('actually reach the URL', async () => {
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
      });

      describe('to invalid URL', function () {});
      it('return 404 as expected', async () => {
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
});
