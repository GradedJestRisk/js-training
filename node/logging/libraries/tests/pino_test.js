const { expect } = require('chai');
const { stdout } = require('test-console');

describe('pino', function () {
   describe('#info', function () {
      it('should send message to stdout', async function () {
         // given
         const logger = require('pino')();

         // when
         const output = stdout.inspectSync(() => {
            logger.info('foo');
         });

         // then
         expect(output).to.deep.equal(['foo']);
      });
   });
});
