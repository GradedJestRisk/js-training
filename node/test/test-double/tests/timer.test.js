const sinon = require('sinon');
const { expect }  = require('chai');

describe('#useFakeTimers', ()=>{

   let clock;
   const fakedDate = new Date('2019-01-01T05:06:07Z');

   beforeEach(function () {
      clock = sinon.useFakeTimers(fakedDate);
   });

   afterEach(function () {
      clock.restore();
   });

   it('Date should return faked date', ()=>{
      // given

      // when
      const date = new Date();

      // then
      expect(date).to.deep.equal(fakedDate)
   })

   it('tick should go forward in time for Date', ()=>{
      // given

      const now = new Date();
      now.setMilliseconds(510);

      // when
      clock.tick(510);

      // then
      const date = new Date();
      expect(date).to.deep.equal(now)
   })

   it('tick should go forward in time for setTimeout', ()=>{
      // given
      let foo = false;
      setTimeout( ()=>{ foo = true}, 2000)

      // when
      clock.tick(1000);

      // then
      expect(foo).to.be.false;

      // when
      clock.tick(1000);

      // then
      expect(foo).to.be.true;
   })

})
