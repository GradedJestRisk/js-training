const path = require('path');
const { spawn } = require('child_process');
const { expect } = require('chai');

describe('logger', () => {
   it('logs out multiple params - 2 strings', done => {
      const testAppFilePath = path.join(
         __dirname,
         './use-logger.js',
      )
      const testApp = spawn('node', [testAppFilePath])

      testApp.stdout.on('data', data => {
         const stdoutData = data.toString()
         expect(stdoutData).to.equal('[foo] this is a message\n')
         testApp.kill('SIGINT')
         done()
      })
   })
});
