import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const folderName = 'directory';

try {
   const files = await readdir(folderName, { withFileTypes: true });

   console.log(`\n *** Directory ${folderName} content is :  ***`);
   files.forEach(file => {
      console.log(`${file.name} - directory:  ${file.isDirectory()}`);
   });

   for (const file of files) {

      if (file.isDirectory()) {
         continue;
      }

      if (file.name.endsWith('.json')) {
         const fileURL = pathToFileURL(join(folderName, file.name));
         const content = await readFile(fileURL, { encoding: 'utf8' });
         console.log(`\n *** JSON file ${file.name} content is : ***`);
         console.log(content);
         continue;
      }

      if (file.name.endsWith('.js')) {

         console.log(`\n *** JS file ${file.name} content is : ***`);

         const fileURL = pathToFileURL(join(folderName, file.name));
         const module = await import(fileURL);
         const namedExports = Object.entries(module);
         for (const namedExport of namedExports) {
            const name = namedExport[0];
            const source = namedExport[1];

            console.log(`Name: ${name}`);
            console.log(`Source : ${source}`);
         }
      }

   }

} catch (error) {
   console.error(error);
}

