const assert = require('assert').strict;


describe('native (node)', () => {
   describe('assert', () => {
      it('with primitive', () => {
         assert.equal(true, true);
      });
      it('with object reference', () => {
         const bar = { name: 'foo' };
         assert.equal(bar, bar);
         assert.notEqual(bar, { name: 'foo' });
      });
      it('with object content', () => {
         assert.deepStrictEqual({ name: 'foo' }, { name: 'foo' });
         assert.notDeepStrictEqual({ name: 'foo' }, { name: 'bar' });
      });
   });
});
