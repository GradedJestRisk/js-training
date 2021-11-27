const path = require('path');
const { spawn } = require('child_process');
const { expect } = require('chai');

describe('logger', () => {
   it('logs a properly formatted message', done => {
      const SUTFilePath = path.join(
         __dirname,
         './use-logger.js',
      )
      const testApp = spawn('node', [SUTFilePath])

      testApp.stdout.on('data', data => {
         const stdoutData = data.toString();
         expect(stdoutData).to.equal('[foo] this is a message\n')
         testApp.kill('SIGINT')
         done();
      })
   })
});
