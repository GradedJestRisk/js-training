let mutableString = "initialMutableState";
const immutableString = "immutableState";

const object = { string: "initialMutableState" }

let counter = 0;
const nextInteger = function (){ return ++counter; };

module.exports = { mutableString, immutableString, object, nextInteger };