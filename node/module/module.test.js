const chai = require('chai');
const expect = require('chai').expect;

const firstImport = require('./module.js');
let mutableStringFirstImport = firstImport.mutableString
const immutableStringFirstImport = firstImport.immutableString;
const nextIntegerFirstImport = firstImport.nextInteger;

const secondImport = require('./module.js');
let mutableStringSecondImport = secondImport.mutableString
const nextIntegerSecondImport = secondImport.nextInteger;

chai.should();

describe('require', () => {

    it('can be called anywhere', () => {
        expect(() => {
            const importAnywhere = require('./module.js');
        }).not.to.throw();
    });

    it('should import the same values', () => {
        mutableStringFirstImport.should.equal("initialMutableState");
        mutableStringSecondImport.should.equal("initialMutableState");
    });
});

describe('immutableData', () => {
    it('should not be allowed to change', () => {
        expect(() => {
            immutableStringFirstImport = "newState";
        }).to.throw('Assignment to constant variable.');
    });
});

describe('mutableData', () => {

    it('state is not shared - require returns a reference', () => {
        mutableStringFirstImport = "mutatedStateOnFirstImport";
        mutableStringSecondImport.should.equal("initialMutableState");
    });

    it('private state is shared', () => {
        const invokeFirstImport = nextIntegerFirstImport();
        const invokeSecondImport = nextIntegerSecondImport();

        invokeFirstImport.should.equal(1);
        invokeSecondImport.should.equal(2);
    });
});