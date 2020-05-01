console.log();
console.log("-----------------------------------------");
console.log("Importing calee from caller");
console.log("-----------------------------------------");

const callee  = require ('./callee.js');

console.log();
console.log("-----------------------------------------");
console.log("Invoking callee from caller")
console.log("-----------------------------------------");

callee.where_am_i();
