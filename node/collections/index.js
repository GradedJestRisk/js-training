// See https://stackoverflow.com/questions/18541940/map-vs-object-in-javascript

const Dictionnary = require("collections/dict");

const wordDictionnary = new Dictionnary();

const nativeDictionary = [
   {word: 'bar', definition: 'a long, thin, narrow rod'},
   {word: 'foobar', definition: 'fucked up beyond any recognition'}
];

nativeDictionary.map((entry) => {
   wordDictionnary.set(entry.word, entry.definition);
});

nativeDictionary.map((entry) => {
   console.log(`${entry.word} means : ${wordDictionnary.get(entry.word)}`);
});


