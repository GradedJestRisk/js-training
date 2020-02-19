const assert = require('assert').strict;
const chai = require('chai');
chai.should();
let expect = chai.expect;

describe('assertion modes', () => {
  describe('native (node)', () => {
   describe('assert', () => {
    it('works this way', () => {
      assert.equal(true, true);
    });
   });
  });
  describe('BDD', () => {
    describe('should', () => {
      it('works this way', () => {
        true.should.be.true;
      })
    });
    describe('expect', () => {
      it('works this way', () => {
        expect(true).to.be.true;
      });
    });
  });
});

describe('primitive', () => {
  describe('boolean', () => {
    it('the hard way', () => {
      true.should.eq(true);
    })
    it('the easy way', () => {
      true.should.be.true;
    })
  });
});