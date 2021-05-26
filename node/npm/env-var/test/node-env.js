const chai = require('chai');
const expect = chai.expect;

describe('NODE_ENV variable', () => {

   it('is undefined, but if set from outside', () => {
      if (process.env.NODE_ENV !== undefined ){
         expect(process.env.NODE_ENV).to.equal('test');
      } else {
         console.log('NODE_ENV is undefined, execute with npm run node-env');
      }
   });

});
