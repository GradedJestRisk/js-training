const chai = require('chai');
const expect = chai.expect;

// Fails if run from npm test because of non-overriding
// see https://github.com/entropitor/dotenv-cli/issues/46#issuecomment-708394095

// Environment variable are injected by npm task test-dotenv-cli
// Unless properly configured, these tests will fail if launched by IDE
describe('environment variable', () => {

   describe('dotenv-cli npm module load .env file', () => {

      describe('types', () => {

         it('integer', () => {
            expect(process.env.integer).to.equal('3');
            expect(parseInt(process.env.integer)).to.equal(3);
         });

         it('string', () => {
            expect(process.env.string).to.equal('bar');
         });

         it('boolean', () => {
            expect(process.env.boolean).to.equal('true');
            expect(process.env.boolean === 'true').to.be.true;
            expect(Boolean(process.env.boolean)).to.be.true;

            expect(Boolean(process.env.truthyBoolean)).to.be.true;
            expect(Boolean(process.env.falsyBoolean)).to.be.false;
         });

      })

      it('expansion', () => {
         expect(process.env.expandedString).to.equal('http://bar.example.net');
      });

   });

});
