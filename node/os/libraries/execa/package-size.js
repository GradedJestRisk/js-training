const execa = require('execa');
const prettyBytes = require('pretty-bytes');

const execSyncWithArguments = async function ({command, arguments}) {
   try {
      const value = await execa.sync(command, arguments);
      return value.stdout;
   } catch (error) {
      console.error(error);
   }
}


const nodeModuleSize = async function () {
   const dUOutput = await execSyncWithArguments({command: 'du', arguments: ['-sb', './node_modules']});
   const endsAt = dUOutput.indexOf('\t');
   return parseInt(dUOutput.substring(0, endsAt));
};


(async () => {

   // const packageName = 'chalk';
   const packageName = 'js-yaml';
   // const packageName = 'hapi-swagger'; // 39Mb

   const sizeBefore = await nodeModuleSize();
   await uninstallPackage(packageName);
   const sizeAfter = await nodeModuleSize();
   await installPackage(packageName);

   const moduleSize = sizeBefore - sizeAfter;
   console.log(`${packageName} takes ${prettyBytes(moduleSize)}`);
   console.log(`(uninstall make node_modules to go from ${prettyBytes(sizeBefore)} to ${prettyBytes(sizeAfter)})`)
})()



const uninstallPackage = async function (packageName) {
   await execSyncWithArguments({command: 'npm', arguments: ['uninstall', packageName]});
};

const installPackage = async function (packageName) {
   await execSyncWithArguments({command: 'npm', arguments: ['install', packageName]});
};

