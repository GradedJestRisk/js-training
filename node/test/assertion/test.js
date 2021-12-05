const assert = require('assert').strict
const chai = require('chai')

// plugins
chai.use(require('chai-string'))
chai.use(require('chai-datetime'))
chai.use(require('chai-asserttype'))

// Choose one of these two forms
chai.should()
//const should = require('chai').should();

// Choose one of these two forms
const expect = chai.expect
//const expect = require('chai').expect;

chai.use(require('chai-as-promised'))

describe('native (node)', () => {
   describe('assert', () => {
      it('with primitive', () => {
         assert.equal(true, true)
      })
      it('with object reference', () => {
         const bar = { name: 'foo' }
         assert.equal(bar, bar)
         assert.notEqual(bar, { name: 'foo' })
      })
      it('with object content', () => {
         assert.deepStrictEqual({ name: 'foo' }, { name: 'foo' })
         assert.notDeepStrictEqual({ name: 'foo' }, { name: 'bar' })
      })
   })
})

describe('chai', () => {

   // https://www.chaijs.com/api/assert/
   // Very similar to node.js’ but
   // - with a bit of extra sugar
   // - not chainable
   describe('not chainable (not BDD)', () => {
      describe('assert', () => {
         it('works this way', () => {
            const assert = require('chai').assert
            assert.equal(true, true)
         })
         it('default equality operator', () => {
            const assert = require('chai').assert

            assert.equal('0', 0)
            assert.strictEqual(0, 0)
            assert.notStrictEqual('0', 0)

         })
      })
   })

   describe('chainable (BDD)', () => {
      describe('should', () => {
         it('works this way', () => {
            true.should.be.true
         })
      })
      describe('expect', () => {
         it('works this way', () => {
            expect(true).to.be.true
         })
      })
   })
})

describe('primitive ', () => {

   describe('boolean', () => {
      it('the hard way', () => {
         true.should.eq(true)
      })
      it('the easy way', () => {
         true.should.be.true
      })
   })

   describe('string', () => {
      it('the hard way', () => {
         'hello'.should.eq('hello')
         'hello'.should.equal('hello')
         'hello'.should.be.equal('hello')
         // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#equality_operators
         expect('' == false).to.be.true
         expect('' == undefined).not.to.be.true
         expect('' == null).not.to.be.true
         ''.should.not.be.undefined
         ''.should.not.be.null

         expect('' === false).not.to.be.true
         expect('' === undefined).not.to.be.true
         expect('' === null).not.to.be.true

      })
      it('the easy way', () => {
         'hello'.should.equalIgnoreCase('Hello')
         'Hello, world !'.should.startWith('Hello')
      })
   })
   describe('number', () => {

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#equality_operators
      it('for strict equality (double =)', () => {
         expect(0 == '0').to.be.true
         expect(0 == '1').to.be.false
      })

      it('equal for strict equality (triple =)', () => {

         expect(0).to.equal(0)
         expect(0 === 0).to.be.true

         expect(0).not.to.equal('0')
         expect(0 === '0').not.be.true
      })

      it('finite', () => {
         expect(0).to.be.finite
         expect('calvin').not.to.be.finite
         expect(undefined).not.to.be.finite
         expect(null).not.to.be.finite
         expect(NaN).not.to.be.finite
         expect(1 / 0).not.to.be.finite
      })
      it('infinity', () => {
         expect(1 / 0).to.equal(Infinity)
      })
   })
   describe('dateTime', () => {

      describe('type', () => {

         it('yes', () => {
            const christmas = new Date(2019, 12, 24, 23, 59)
            expect(christmas).to.be.a('Date')
         })

         it('yes', () => {
            const string = 'value'
            expect(string).not.to.be.a('Date')
         })

      })

      describe('same Day', () => {

         it('yes', () => {
            const christmasMorning = new Date(2019, 12, 24, 7, 1)
            const christmasNight = new Date(2019, 12, 24, 23, 59)
            christmasMorning.should.equalDate(christmasNight)
         })

         it('no', () => {
            const christmas = new Date(2019, 12, 24, 23, 59)
            const newYear = new Date(2020, 1, 1, 1)
            expect(christmas).not.to.equalDate(newYear)
         })

         it('no (with guards)', () => {
            const oneMinuteBeforeMidnight = new Date(2019, 12, 24, 23, 59)

            const nullDate = null
            expect(nullDate).to.be.null
            expect(nullDate).not.to.be.a('Date')

            const undefinedDate = undefined
            expect(undefinedDate).be.undefined
            expect(undefinedDate).not.to.be.a('Date')

            const oneAM = new Date(2019, 12, 24, 1)
            expect(oneAM).to.be.a('Date')
            oneAM.should.equalDate(oneMinuteBeforeMidnight)
         })
      })

      describe('before', () => {

         it('with plugin', () => {
            const christmas = new Date(2019, 12, 24, 23, 59)
            const newYear = new Date(2020, 1, 1, 1)
            christmas.should.beforeTime(newYear)
         })

         it('without plugin', () => {
            const christmasMorning = new Date(2019, 12, 24, 7, 1)
            const christmasNight = new Date(2019, 12, 24, 23, 59)
            christmasNight.should.be.above(christmasMorning)
            christmasMorning.should.be.below(christmasNight)
         })
      })
   })
})

describe('object', () => {

   // https://github.com/chaijs/deep-eql
   it('be.deep.equal compare object content', () => {
      const expected = {
         name: 'calvin',
         type: 'human'
      }
      const actual = {
         name: 'calvin',
         type: 'human'
      }
      actual.should.be.deep.equal(expected)
   })

   it('include compare object partial content', () => {
      const expected = { type: 'human' }

      const including = {
         name: 'calvin',
         type: 'human'
      }
      including.should.include(expected)

      const nonIncluding = {
         name: 'calvin',
         color: 'red'
      }
      nonIncluding.should.not.include(expected)
   })

   it.skip('include compare array s object partial content', () => {
      const expectedPerson = { type: 'human' }
      const expectedPeople = [expectedPerson, expectedPerson]

      const calvin = {
         name: 'calvin',
         type: 'human'
      }
      const dad = {
         name: 'dad',
         type: 'human'
      }
      const people = [calvin, dad]
      // TODO: this fail, find another way (other than individual checks, maybe chai-things)
      people.should.include(expectedPeople)
   })

   // TODO: add sealed and frozen
})

describe('array', () => {

   it('check type (chai-asserttype plugin)', () => {
      expect([]).to.be.array()
   })

   it('emptiness', () => {
      expect([]).to.be.empty
   })

   describe('of values', () => {

      describe('check content', () => {

         it('regardless of order ', () => {
            const sortedArray = [1, 3, 2]
            const unsortedArray = [1, 2, 3]

            expect(sortedArray).to.have.members(unsortedArray)
         })

         it('including order ', () => {
            const sortedArray = [1, 3, 2]
            const unsortedArray = [1, 2, 3]

            expect(sortedArray).not.to.have.ordered.members(unsortedArray)
         })
      })

      describe('check inclusion of set in superset', () => {

         it('regardless of order', () => {
            const set = [1, 2]
            const superset = [1, 2, 2, 3]

            expect(superset).to.include.members(set)
         })

         it('including order', () => {
            const set = [1, 2]
            const superset = [1, 3, 2]

            expect(superset).not.to.include.ordered.members(set)
         })

      })

   })

   describe('of objects', () => {

      describe('check content', () => {

         it('regardless of order ', () => {
            const sortedArray = [{ name: 'bar' }, { name: 'foo' }]
            const unsortedArray = [{ name: 'foo' }, { name: 'bar' }]

            expect(sortedArray).to.have.deep.members(unsortedArray)
         })

         it('including order ', () => {
            const sortedArray = [{ name: 'bar' }, { name: 'foo' }]
            const unsortedArray = [{ name: 'foo' }, { name: 'bar' }]

            expect(sortedArray).not.to.have.deep.ordered.members(unsortedArray)
         })
      })

      describe('check inclusion of set in superset', () => {

         it('regardless of order ', () => {
            const set = [{ name: 'foo' }, { name: 'bar' }]
            const superset = [{ name: 'foo' }, { name: 'foobar' }, { name: 'bar' }]

            expect(superset).to.deep.include.members(set)
         })

         it('including order ', () => {
            const set = [{ name: 'foo' }, { name: 'bar' }]
            const superset = [{ name: 'foo' }, { name: 'foobar' }, { name: 'bar' }]

            expect(superset).not.to.deep.include.ordered.members(set)
         })
      })
   })

})

describe('promise (with chai-as-promised', () => {
   it('should check return value', async () => {
      const value = 1
      const foo = new Promise((resolve, reject) => {
         resolve(value)
      })

      return foo.should.eventually.equal(value)
   })

   it('should check return value with argument', async () => {
      const value = 1
      const invert = function (value) {
         return new Promise((resolve) => {
            resolve(value * -1)
         })
      }

      return invert(value).should.eventually.equal(value * -1)
   })
})

describe('corner case', () => {

   describe('error case', () => {
      it('should check it throws (expect)', () => {
         const throwingFunction = function () {
            throw new Error()
         }
         expect(throwingFunction).to.throw()
      })

      it('should check it throws (should)', () => {
         const throwingFunction = function () {
            throw new Error()
         }
         throwingFunction.should.throw()
      })

      it('should check it throws (IIFE)', () => {
         expect(() => {
            throw new Error()
         }).to.throw()
      })

      it('should check partial error message', () => {
         const throwingFunction = function () {
            throw new Error('error message')
         }
         expect(throwingFunction).to.throw('message')
      })

      it('should check error message in promise (chai-as-promised)', async () => {
         const rejectionMessage = 'error message'
         const throwingFunction = new Promise((resolve, reject) => {
            reject('error message')
         })

         return throwingFunction.should.be.rejectedWith(rejectionMessage)
      })

   })

   describe('special values', () => {

      it('undefined', () => {
         expect(undefined).to.be.undefined
      })

      it('null', () => {
         expect(null).to.be.null
      })

      it('NaN', () => {
         expect(NaN).to.be.NaN
      })
   })
})

