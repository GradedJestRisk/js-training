const { expect } = require('chai')
const { spawn } = require('child_process')

const spawnCommand = (command) => {
   return spawn('node', ['-e', `"${command}"`], {
      shell: true,
      cwd: './stdout/'
   })
}
describe('logger', function () {

   describe('#log', function () {
      it('put message to stdout', function (done) {

         const command = `const logger = require('./logger.js')({});
                       logger.log('this is a message');`

         const process = spawnCommand(command)

         process.stdout.on('data', (data) => {
            const stdoutData = data.toString()
            expect(stdoutData).to.equal('this is a message\n')
            process.kill('SIGINT')
            done()
         })
      })
      it('include tag if provided', function (done) {

         const command = `const logger = require('./logger.js')({ tag: 'tag'});
                       logger.log('this is a message');`

         const process = spawnCommand(command)

         process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`)
         })

         process.stdout.on('data', (data) => {
            const stdoutData = data.toString()
            // console.log(`stdout: ${data}`);
            expect(stdoutData).to.equal('[tag] this is a message\n')
            process.kill('SIGINT')
            done()
         })
      })
      it('disableLog should suppress output', function (done, fail) {

         const command = `const logger = require('./logger.js')({ disableLogs : true});
                       logger.log('this is a message');`

         const process = spawnCommand(command)
         setTimeout(done, 300);
         process.stdout.on('data', () => {
            fail();
         });
      })
   })

   describe('#error', function () {
      it('put message to stderr', function (done) {

         const command = `const logger = require('./logger.js')({});
                       logger.error('this is a message');`

         const process = spawnCommand(command)

         process.stderr.on('data', (data) => {
            const parsedData = data.toString()
            // console.log(`stdout: ${data}`);
            expect(parsedData).to.equal('this is a message\n')
            process.kill('SIGINT')
            done()
         })
      })
   })

})
