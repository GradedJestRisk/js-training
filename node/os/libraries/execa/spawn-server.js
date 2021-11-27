const { spawn } = require('child_process');
// const process = spawn('ls', ['-ltr'], { cwd: './script'});
const process = spawn('./server', [], { cwd: './script', shell:true});
//const process = spawn('node', ['server.js'], { cwd: './script', shell:true});

process.stdout.on('data', (data) => {
   console.log(`stdout: ${data}`);
});

process.stderr.on('data', (data) => {
   console.error(`stderr: ${data}`);
});

process.on('close', (code) => {
   console.log(`child process exited with code ${code}`);
});

