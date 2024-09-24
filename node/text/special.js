const string = process.argv[2];
// const string = "hello, world!"

console.log(string)

console.log("")

string.split('').forEach ((character)=> {
   console.log(character, character.charCodeAt(0),  );
});

