const { it } = require('mocha');
const calc = require('./calc.js');
const asyncCalculator = require('./async-calc.js');

const chai = require('chai');
const expect = chai.expect;
chai.should();

const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('parameterized tests',()=>{

   const testCases = [
      { i: 0, j: 0, expected: 0 },
      { i: 1, j: 2, expected: 3 } ];

   testCases.forEach(function(testCase) {
      it(`should add ${testCase.i} and ${testCase.j}`, () => {
         expect(calc.add(testCase.i, testCase.j)).to.equal(testCase.expected);
      });
   });

   testCases.forEach(function(testCase) {
      it(`should add under async ${testCase.i} and ${testCase.j}`, async () => {
         const result = await asyncCalculator.addAsync(testCase.i, testCase.j);
         expect(result).to.equal(testCase.expected);
      });
   });

   testCases.forEach(function(testCase) {
      it(`should add under promise ${testCase.i} and ${testCase.j}`, () => {
         asyncCalculator.addPromise(testCase.i, testCase.j).should.eventually.equal(testCase.expected);
      });
   });

})
