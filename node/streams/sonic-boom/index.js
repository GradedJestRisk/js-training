const SonicBoom = require('sonic-boom')

// Write to console
const sonic = new SonicBoom({ fd: process.stdout.fd })

// Write to file
// const sonic = new SonicBoom({ dest: '/tmp/sonic.log' });

for (let i = 0; i < 10; i++) {
   sonic.write('hello sonic\n')
}
