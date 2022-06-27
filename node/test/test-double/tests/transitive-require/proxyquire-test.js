const { expect }  = require('chai');
const proxyquire = require('proxyquire');
const uuidStub = { };

const service = proxyquire('./src/service', { uuid: uuidStub });


// https://stackoverflow.com/questions/46129066/how-to-stub-es6-node-modules-when-using-import
describe('service', () => {
   it('doSomething should return deterministic id, but fails', () => {
      // given
      uuidStub.v4 = () => 'a4ead786-95a2-11e7-843f-28cfe94b0175';

      // when
      const actual = service.doSomething();
      // then
      expect(actual).to.equal('a4ead786-95a2-11e7-843f-28cfe94b0175')
   });
});
