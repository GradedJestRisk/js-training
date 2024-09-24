import { writeFileSync, unlinkSync, readFileSync } from "fs";
const line1 = "bla"
const line2 = "blah"
const newline = "\n"
const endOfFile = newline;
const content = line1 + newline + line2 + endOfFile;
const name = "test.txt";
const directory = '/tmp';

const writeFile = (name, content)=>{
   const file = directory + '/' + name;
   const data = content;
   // const options = { encoding: 'utf8', mode: '0o666', flag : 'w', flush: true };
   const options = 'utf-8';
   writeFileSync( file, data, options );
}

// https://nodejs.org/api/fs.html#fsunlinksyncpath
const removeFile = (name)=>{
   const path = directory + '/' + name;
   unlinkSync(path)
};

const readFile = (name)=>{
   const options = { encoding: 'utf8', flag: 'r' };
   const path = directory + '/' + name;
   const data = readFileSync(path, options );
   return data;
}

console.log("Content is " + content);

console.log("Writing : " + name);
writeFile(name, content);

console.log("Reading : " + name);
const readContent = readFile(name);
console.log("Content is " + readContent);

console.log("Removing : " + name);
removeFile(name);


