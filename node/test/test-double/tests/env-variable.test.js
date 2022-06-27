// https://stackoverflow.com/questions/24589021/how-to-stub-process-env-in-node-js
const chai = require('chai');
const expect = chai.expect
const sinon = require('sinon');

function requireUncached(module) {
   delete require.cache[require.resolve(module)];
   return require(module);
}

describe('environment variable in SUT', async () => {

   beforeEach(() => {
      delete process.env.FOO;
   });

   it('are read on require time', async () => {
      // given
      process.env.FOO = 'a';

      // when
      const data = require('../src/environment-variable')

      // then
      expect(data).to.deep.equal({foo: 'a'})
   })


   it('and are not references', async () => {

      // given
      process.env.FOO = 'a';
      require('../src/environment-variable')

      // given
      process.env.FOO = 'b';
      // if you use the usual require
      // and run this test only, it will succeed
      // and run all suite, it will fail with 'a' as value, because the module is cached
      const cachedVersion = require.cache[require.resolve('../src/environment-variable')]
      expect(cachedVersion.exports).to.deep.equal({foo: 'a'})

      const data = requireUncached('../src/environment-variable')

      // when
      process.env.FOO = 'c';

      // then
      expect(data).to.deep.equal({foo: 'b'})
   })

   it('can be mocked', async () => {
      // given
      process.env.FOO = 'd';
      const stub = sinon.stub(process.env, 'FOO').value('e');

      // when
      const data = requireUncached('../src/environment-variable')

      // then
      expect(data).to.deep.equal({foo: 'e'})

      // given
      stub.restore();

      // when
      expect(process.env.FOO).to.deep.equal('d')

   })



});
