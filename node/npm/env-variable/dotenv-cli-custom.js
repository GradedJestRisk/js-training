const chai = require('chai');
const expect = chai.expect;

// Environment variable are injected by npm task test-dotenv-custom-file
// Unless properly configured, these tests will fail if launched by IDE
describe('environment variable', () => {

   describe('dotenv-cli npm module custom .env file (here, .env.test) ', () => {

      it('integer', () => {
         expect(process.env.integer).to.equal('1');
      });

   });

});
