const foo = require('../lib/foo');
const {expect}= require('chai')
describe("foo",()=>{
   it('should return bar',()=>{
      const result = foo.bar();
      expect(result).to.equal('foobar')
   })
})
