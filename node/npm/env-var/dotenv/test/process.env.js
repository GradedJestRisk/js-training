const chai = require('chai');
const expect = chai.expect;

describe('process.env', () => {

   it('is a data-structure', () => {
      const envVariableCount = Object.keys(process.env).length;
      console.log(envVariableCount, 'environment variables');
      expect(envVariableCount).to.be.greaterThan(0);
   });

   // DEP0104: process.env string coercion
   // https://nodejs.org/api/all.html#DEP0104
   it('cast boolean into strings', () => {
      process.env.MY_BOOLEAN = true;
      expect(process.env.MY_BOOLEAN).not.to.be.true;
      expect(process.env.MY_BOOLEAN).to.equal('true');
   });

});
