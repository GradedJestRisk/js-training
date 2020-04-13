const assert = require('assert').strict;
const chai = require('chai');

// Choose one of these two forms
chai.should();
//const should = require('chai').should();

// Choose one of these two forms
const expect = chai.expect;
//const expect = require('chai').expect;

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

describe('object', () => {
    it('be.deep.equal compare object content', () => {
      const expected = { name: 'calvin', type: 'human'};
      const actual = { name: 'calvin', type: 'human'};
      actual.should.be.deep.equal(expected);
    });

  it.skip('include compare object partial content - how ?', () => {
    const expected = {type: 'human'};
    const actual = { name: 'calvin', type: 'human'};
    // TODO: this fail, find another way (other than individual checks, maybe chai-things)
    actual.should.include(expected);
  });

  it('include compare array s object partial content', () => {
    const expectedPerson = {type: 'human'};
    const expectedPeople = [expectedPerson, expectedPerson];

    const calvin = { name: 'calvin', type: 'human'};
    const dad = { name: 'dad', type: 'human'};
    const people = [calvin, dad];
    people.should.include(expectedPeople);
  });
});


describe('error handling', () => {

  it('should check it throws', ()=>{
    const throwingFunction = function () { throw new Error(); };
    expect(throwingFunction).to.throw();
  });

  it('should check partial error message', ()=>{
    const throwingFunction = function () { throw new Error('error message'); };
    expect(throwingFunction).to.throw('message');
  });

});