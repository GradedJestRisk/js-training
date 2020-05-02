let mutableString = "initialMutableState";
const immutableString = "immutableState";

let counter = 0;
const nextInteger = function (){ return(++counter); };
module.exports = { mutableString, immutableString, nextInteger };