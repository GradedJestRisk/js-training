const { expect } = require('chai');
const {
   stdout,
   stderr
} = require('test-console');
const { logger } = require('../src/console');

describe('console', function() {
   describe('#info', function() {
      it('should send message to stdout', async function() {

         // when
         const output = stdout.inspectSync(() => {
            logger.info({ data: 'foo' });
         });

         // then
         expect(output).to.deep.equal(['foo\n']);
      });
   });
   describe('#error', function() {
      it('should send message to stderr', async function() {

         // when
         const output = stderr.inspectSync(() => {
            logger.error({ data: 'foo' });
         });

         // then
         expect(output).to.deep.equal(['foo\n']);
      });
   });
});
