const findDuplicateDependencies = require('find-duplicate-dependencies');
const prettyBytes = require('pretty-bytes');
const axios = require('axios')
const packageDependencies = require('./package.json').dependencies;

const find = async () => {

   const dependencies = await findDuplicateDependencies();

   const dependenciesNameCount = Object.keys(dependencies).map((dependency) => {
      return {name: dependency, count: dependencies[dependency].length}
   })

   const dependenciesNameCountSize = await Promise.all(dependenciesNameCount.map(async (dependency) => {

      // keep in touch with npmjs rate-limit
      await new Promise((resolve) => {
         setTimeout(function() {
            resolve();
         }, 200);
      });

      const response = await axios.get(`https://registry.npmjs.org/${dependency.name}`);
      const versions = response.data.versions;
      const size = versions[Object.keys(versions)[Object.keys(versions).length - 1]].dist.unpackedSize;
      if (size) {
         return {...dependency, size};
      } else {
         return {}
      }
   }));

   const dependenciesNameCountSizeRoot = dependenciesNameCountSize.filter(dependency => packageDependencies[dependency.name])

   dependenciesNameCountSizeRoot.sort((a, b) => {
      return (b.size - a.size)
   })

   const totalSize = dependenciesNameCountSizeRoot.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue.size;
   }, 0);

   console.log('Duplicated dependencies ( a version in main package, and at least another version in transitive dependencies')
   console.log(`${dependenciesNameCountSizeRoot.length} are duplicated, total ${prettyBytes(totalSize)}`)

   dependenciesNameCountSizeRoot.map(dependency =>
      console.log(`${dependency.name} is duplicated ${dependency.count} times, ${prettyBytes(dependency.size)} each`)
   );
}

(async () => {
   await find();
})()
