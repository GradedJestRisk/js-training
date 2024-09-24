// Online
// http://incaseofstairs.com/jsdiff/


// https://github.com/kpdecker/jsdiff
require('colors');
const Diff = require('diff');

// const expected = 'beep boob blah';
// const expected = process.argv[3];
const expected =  `id de la trace;id de la trace associée;Date;Heure;Action;Élément ayant subi l'action;Auteur de l'action;Identité de l'auteur;Organisation;Autorité de traitement;Application;Type de périmètre;Type de trace;Changements\r\n659aab45-cd06-452b-99d2-9b8cf18f352c;;01/01/1900;00:00:00;consultation-dossier;"=""1""";1441319;JeanMi MII;751;751;access;dossier;écriture;\r\n`


// const actual = 'beep boop';
// const actual = process.argv[2];
const actual = `id de la trace;id de la trace associée;Date;Heure;Action;Élément ayant subi l'action;Auteur de l'action;Identité de l'auteur;Organisation;Autorité de traitement;Application;Type de périmètre;Type de trace;Changements\r\n659aab45-cd06-452b-99d2-9b8cf18f352c;;01/01/1900;00:00:00;consultation-dossier;"=""1""";1441319;JeanMi MII;751;751;access;dossier;écriture;\r\n`


console.log("Actual is " + actual);
console.log("Expected is " + expected);

const diff = Diff.diffChars(actual, expected);

console.log("diff is : " + JSON.stringify(diff, null, 3));

// diff.forEach((part) => {
//    // green for additions, red for deletions
//    let text = part.added ? part.value.bgGreen :
//       part.removed ? part.value.bgRed :
//          part.value;
//    console.log(text);
// });

