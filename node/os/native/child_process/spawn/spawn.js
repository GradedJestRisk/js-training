const { spawn } = require('child_process');
// const process = spawn('ls', ['-lh', '/usr'], { cwd: });
// const process = spawn('pwd', ['-L'], { cwd: '../..'});
// const process = spawn('pwd', ['-L'], { cwd: './script', shell:true});
// const process = spawn('hello', [], { cwd: './script', shell:true});
// const process = spawn('node', ['hello.js'], { cwd: './script', shell:true});
// const process = spawn('node', ['-e', '\"console.log(\'hello, world\')\"'], {  shell:true});

const command = `const logger = require('./script/logger.js'); logger.log('this is a message');`
const process = spawn('node', ['-e', `"${command}"`], { shell: true, cwd: '.' })

process.stdout.on('data', (data) => {
   console.log(`stdout: ${data}`);
});

process.stderr.on('data', (data) => {
   console.error(`stderr: ${data}`);
});

process.on('close', (code) => {
   console.log(`child process exited with code ${code}`);
});
