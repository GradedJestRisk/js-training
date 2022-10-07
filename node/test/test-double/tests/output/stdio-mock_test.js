const { expect } = require('chai');
const { MockWritable, stdio } = require('stdio-mock');
const { stdout, stdin } = stdio();

describe('stdio-mock', function () {
   describe('data', function () {
      it('should return data sent to stdout', async function () {
         // given
         stdout.on('data', (data) => {
            expect(data).to.deep.equal(['toast']);
            done();
         });

         // when
         console.log('test');
      });
   });
   describe('MockWritable', function () {
      it('should return data sent to stdout', async function () {
         // given
         const writable = new MockWritable();

         // when
         writable.write('test');

         // then
         const data = writable.data();
         expect(data).to.deep.equal(['test']);
      });
   });
});
