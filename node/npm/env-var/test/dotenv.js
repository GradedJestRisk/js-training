const chai = require('chai');
const expect = chai.expect;

describe('environment variable', () => {

   describe('dotenv npm module load .env file', () => {

      describe('types', () => {

         before(() => {
            require('dotenv').config();
         })

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

      });

   });

   describe('dotenv-expand', ()=>{

      before(() => {
         const dotenv = require('dotenv');
         const dotenvExpand = require('dotenv-expand');
         const myEnv = dotenv.config();
         dotenvExpand(myEnv)
      })

      it('expansion', () => {
         expect(process.env.expandedString).to.equal('http://bar.example.net');
      });

   })

});
