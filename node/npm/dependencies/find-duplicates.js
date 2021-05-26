const findDuplicateDependencies = require('find-duplicate-dependencies');

findDuplicateDependencies().then(
   function(duplicates) {

      /*
      duplicates has the following format:

      {
        "tar": [
          {
            name: 'tar',
            version: '1.0.3',
            from: 'tar@>=1.0.0 <2.0.0',
            path: 'test/npm/node-gyp'
          },
          {
            name: 'tar',
            version: '2.1.1',
            from: 'tar@>=2.1.1 <2.2.0',
            path: 'test/npm'
          }
        ],
        "mime-types": [
          {
            name: 'mime-types',
            version: '2.1.2',
            from: 'mime-types@>=2.1.1 <3.0.0',
            path: 'test/npm/request/form-data'
          },
          {
            name: 'mime-types',
            version: '2.0.14',
            from: 'mime-types@>=2.0.1 <2.1.0',
            path: 'test/npm/request'
          }
        ]
      }
      */

      if (Object.keys(duplicates).length) {

         console.log('Duplicates');
         console.dir(duplicates);
         return process.exit(1);
      }

      console.log('No duplicates');
   }
).catch(function(err) {

   console.error(err.stack);
   return process.exit(1);
});
