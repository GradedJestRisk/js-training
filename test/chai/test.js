const assert = require('assert').strict;
const chai = require('chai');
chai.use(require('chai-string'));

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
    describe('string', () => {
        it('the hard way', () => {
            "hello".should.eq("hello");
            "hello".should.equal("hello");
            "hello".should.be.equal("hello");
        })
        it('the easy way', () => {
            "hello".should.equalIgnoreCase("Hello");
            "Hello, world !".should.startWith("Hello");
        })
    });
    describe('number', ()=>{
        it('equal', ()=>{
            expect(0).to.equal(0);
        })
        it('finite', ()=>{
            expect(0).to.be.finite;
            expect('calvin').not.to.be.finite;
            expect(null).not.to.be.finite;
            expect(NaN).not.to.be.finite;
            expect(1/0).not.to.be.finite;
        })
        it('infinity', ()=>{
            expect(1/0).to.equal(Infinity)
        })
     })
});

describe('object', () => {
    it('be.deep.equal compare object content', () => {
        const expected = {name: 'calvin', type: 'human'};
        const actual = {name: 'calvin', type: 'human'};
        actual.should.be.deep.equal(expected);
    });

    it.skip('include compare object partial content - how ?', () => {
        const expected = {type: 'human'};
        const actual = {name: 'calvin', type: 'human'};
        // TODO: this fail, find another way (other than individual checks, maybe chai-things)
        actual.should.include(expected);
    });

    it('include compare array s object partial content', () => {
        const expectedPerson = {type: 'human'};
        const expectedPeople = [expectedPerson, expectedPerson];

        const calvin = {name: 'calvin', type: 'human'};
        const dad = {name: 'dad', type: 'human'};
        const people = [calvin, dad];
        people.should.include(expectedPeople);
    });
    
    // TODDO: add sealed and frozen
});

describe('corner case', () => {

    describe('error case', () => {
        it('should check it throws (expect)', () => {
            const throwingFunction = function () {
                throw new Error();
            };
            expect(throwingFunction).to.throw();
        });

        it('should check it throws (should)', () => {
            const throwingFunction = function () {
                throw new Error();
            };
            throwingFunction.should.throw();
        });

        it('should check it throws (IIFE)', () => {
            expect(() => {
                throw new Error()
            }).to.throw();
        });

        it('should check partial error message', () => {
            const throwingFunction = function () {
                throw new Error('error message');
            };
            expect(throwingFunction).to.throw('message');
        });
    });

    describe('special values', () => {

        it('undefined', () => {
            expect(undefined).to.be.undefined;
        });

        it('undefined', () => {
            expect(null).to.be.null;
        });

        it('NaN', () => {
            expect(NaN).to.be.NaN;
        });
    });
});

