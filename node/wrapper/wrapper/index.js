const execa = require('execa');
const colors = require('colors');

const execSync = async function(command){
    try {
        const value = await execa.commandSync(command);
        // {   command: 'uptime --pretty',
        //     exitCode: 0,
        //     stdout: 'up 1 hour, 23 minutes',
        //     stderr: '',
        //     failed: false,
        //     timedOut: false,
        //     isCanceled: false,
        //     killed: false }
        console.log('command: '.bold + value.command + ' ended successfully'.green.bold );
        console.log('exitCode: '.bold + value.exitCode);
        console.log('stdout: '.bold + value.stdout);
        console.log('stderr: '.bold + value.stderr);

    } catch (error) {
        console.log('command: ' + error.command + ' ended with error'.red.bold );
        console.log('shortMessage: '.bold + error.shortMessage);
        console.log('exitCode: '.bold + error.exitCode);
        console.log('stderr: '.bold + error.stderr);
        //console.dir(error);
        /*
        {
          shortMessage: 'Command failed with exit code 1: uptime -e-pretty',
          command: 'uptime -e-pretty',
          exitCode: 1,
          signal: undefined,
          signalDescription: undefined,
          stdout: '',
          stderr: 'uptime: invalid option -- \'e\'\n\nUsage:\n uptime [options]\n\nOptions:\n -p, --pretty   show uptime in pretty format\n -h, --help     display this help and exit\n -s, --since    system up since\n -V, --version  output version information and exit\n\nFor more details see uptime(1).',
          failed: true,
          timedOut: false,
          isCanceled: false,
          killed: false
          }
        */
    }
};

const execSyncWithArguments = async function({ command, arguments }){
    try {
        const value = await execa.sync(command, arguments);
        console.dir(value);
    } catch (error){
        console.error(error);
    }
}
const uptime = { command: 'uptime', arguments: ['--pretty']}

// -------- WILL SUCCEED -------- //

// command and arguments are joined
// => execSync('uptime --pretty')
//return execSync(uptime.command + ' ' + uptime.arguments);

// command and arguments are separate
// => execSync('uptime', ['--pretty'])
return execSyncWithArguments(uptime);

// -------- WILL FAIL -------- //
// uncomment to raise error
//return execSync('uptime -e-pretty');
