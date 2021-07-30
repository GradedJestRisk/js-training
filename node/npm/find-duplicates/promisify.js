const npm = require('npm-stats-api');
const {promisify} = require("es6-promisify");

const find = async () => {
   npm.details[promisify.argumentNames] = ["url"];
   const foo = promisify(npm.details);
   const result = await foo('chalk');
   console.log(result)
};


(async () => {
   await find();
})()
