// CAUTION NOT TO BE DRIVEN CRAZY //

// invalid cwd throws with misleading error message
// Error: spawn /usr/local/bin/node ENOENT
// https://github.com/nodejs/node/issues/11520

// In cwd option, current directory (.) is node_module containing folder
// NOT the one that contains teh caller file

// Always listen to stderr event for debug

const { spawn } = require('child_process');
// const process = spawn('pwd', ['-L'], { cwd: '../script'});
// const process = spawn('ls', ['-ltrh'], { cwd: '../script' , shell:true });
const process = spawn('./hello', [], { cwd: '../script', shell:true });

// const process = spawn('pwd', ['-L'], { cwd: './script', shell:true});

// const process = spawn('node', ['hello.js'], { cwd: './script', shell:true});
// const process = spawn('node', ['-e', '\"console.log(\'hello, world\')\"'], {  shell:true});

// const command = `const logger = require('./script/logger.js'); logger.log('this is a message');`
// const process = spawn('node', ['-e', `"${command}"`], { shell: true, cwd: '.' })

process.stdout.on('data', (data) => {
   console.log(`stdout: ${data}`);
});

process.stderr.on('data', (data) => {
   console.error(`stderr: ${data}`);
});

process.on('close', (code) => {
   console.log(`child process exited with code ${code}`);
});
