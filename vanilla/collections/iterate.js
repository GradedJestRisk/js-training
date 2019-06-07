#! /usr/bin/env node

console.log("");
console.log("String :");
let string = 'this is a string';
for (let char of string) {    
    process.stdout.write("-" + char);
}

console.log("");
console.log("Array :");
let array = ["apple", "orange", "banana"];
for (let cell of array) {
    //console.log("Character :", char);
    process.stdout.write("-" + cell);
}

let map = new Map([['a', 1], ['b', 2], ['c', 3]]);

console.log("");
console.log("Map elements:");
for (let element of map) {
    process.stdout.write("-" + element);
}

console.log("");
console.log("Map key/values:");
for (let [key, value] of map) {
    process.stdout.write(" [" + key + "," + value + "]");
}