const { expect } = require('chai')
const { spawn } = require('child_process')

describe('#log', () => {
   it('put message to stdout', done => {

      const sut = spawn('node', ['-e', '\"console.log(\'hello, world\')\"'], { shell: true })

      sut.stdout.on('data', data => {
         const stdoutData = data.toString()
         expect(stdoutData).to.equal('hello, world\n')
         sut.kill('SIGINT')
         done()
      })
   })
})
