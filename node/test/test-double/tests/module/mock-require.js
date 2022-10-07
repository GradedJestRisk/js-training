// https://stackoverflow.com/questions/24589021/how-to-stub-process-env-in-node-js
const chai = require('chai');
const expect = chai.expect;
const mock = require('mock-require');

// to load cache
process.env.FOO = '1';
require('./src/service');

describe('mock-require', async () => {
   afterEach(() => {
      mock.stopAll();
   });

   it('should prevent transitive require to be called', async () => {
      // given
      mock('./src/service', {
         doSomething: function () {
            return 'b';
         },
      });

      const service = mock.reRequire('./src/service');

      // when
      const data = service.doSomething();

      // then
      expect(data).to.equal('b');
   });

   it('should prevent require to be called', async () => {
      // given
      mock('./src/service', {
         doSomethingElse: function () {
            return 'b';
         },
      });

      const service = mock.reRequire('./src/service');

      // when
      const data = service.doSomethingElse();

      // then
      expect(data).to.equal('b');
   });

   describe('environment variable', () => {
      it('should prevent environmentVariables to be called', async () => {
         // given
         mock('./src/service', {
            environmentVariables: {
               foo: '2',
            },
         });

         // looks unnecessary
         // const service = mock.reRequire('./src/service');
         const service = require('./src/service');

         // when
         const data = service.environmentVariables.foo;

         // then
         expect(data).to.equal('2');
      });
   });
});
