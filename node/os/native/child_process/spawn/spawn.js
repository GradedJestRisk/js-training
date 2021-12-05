// CAUTION NOT TO BE DRIVEN CRAZY //

// invalid cwd throws with misleading error message
// Error: spawn /usr/local/bin/node ENOENT
// https://github.com/nodejs/node/issues/11520

// In cwd option, current directory (.) is node_module containing folder
// NOT the one that contains teh caller file

// Always listen to stderr event for debug

const { spawn } = require('child_process');

// Execute shell built-in commands
// const process = spawn('pwd', ['-L'], { cwd: '../script'});
// const process = spawn('ls', ['-ltrh'], { cwd: '../script' , shell:true });

// Execute a script (here Javascript, but can be anyone specified by shebang)
// const process = spawn('./hello-script', [], { cwd: '../script', shell:true });
// If you check to check cwd..
// const process = spawn('pwd', ['-L'], { cwd: './script', shell:true});

// Ask node to execute a JS file
// const process = spawn('node', ['hello.js'], { cwd: '../script', shell:true});
// stdout: woof, world!


// Ask node to execute a script (which is a JS script)
// const process = spawn('node', ['hello'], { cwd: '../script', shell:true});
// stdout: meow, world!


// 'js' file extension can be skipped, which can be confusing as a script (no extension) can exist with same name
// const process = spawn('node', ['hello'], { cwd: '../script', shell:true});
// stdout: meow, world!
// to give a try, rename hello to hello_
// stdout: woof, world!


// Evaluate some code
// const process = spawn('node', ['-e', '\"console.log(\'hello, world\')\"'], {  shell:true});
// stdout: hello, world

// Evaluate some code (use module)
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
