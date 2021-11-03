const chai = require('chai')
chai.should()

const { bar } = require('../sut/foo')

it('should exercice bar from sut', () => {
   bar(1, 2).should.equal(3)
})
