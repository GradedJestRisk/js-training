const execa = require('execa')
const colors = require('colors')

const execSyncWithArguments = async function({ command, arguments }){
   try {
      const value = await execa.sync(command, arguments);
      // console.dir(value);
      console.log(value.stdout)
   } catch (error){
      console.error(error);
   }
}
const execSync = async function (command) {
   try {
      const value = await execa.commandSync(command)
      console.log('command: '.bold + value.command + ' ended successfully'.green.bold)
      console.log('exitCode: '.bold + value.exitCode)
      console.log('stdout: '.bold + value.stdout)
      console.log('stderr: '.bold + value.stderr)

   } catch (error) {
      console.log('command: ' + error.command + ' ended with error'.red.bold)
      console.log('shortMessage: '.bold + error.shortMessage)
      console.log('exitCode: '.bold + error.exitCode)
      console.log('stderr: '.bold + error.stderr)
      //console.dir(error);
   }
}

const executeNodeScriptAsShellScript = ()=>{
   return execSync('./script/hello')
}

const executeAPIAsShellScript = ()=>{
   return execSync('./script/www')
}

const executeNodeScriptWithNode = ()=> {
   return execSync('node ./script/hello.js')
}

const executeCommandWithNode = ()=> {
   // const query = { command: 'node', arguments: ['--version']}
   const query = { command: 'node', arguments: ['-e', 'console.log(\'hello, world\')']}

   return execSyncWithArguments(query)
}

// executeCommandWithNode()
//executeNodeScriptWithNode()
// executeNodeScriptAsShellScript()
// executeNodeScriptWithNode()

executeAPIAsShellScript()
