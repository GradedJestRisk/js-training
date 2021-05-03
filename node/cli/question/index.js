const chalk = require('chalk');

const colorName = 'blue';
const color = chalk.keyword(colorName);

console.log('I like the ' +  color(colorName) + ' color (concatenation)');
console.log(`I like the ${color(colorName)} color (template-literal)`);

const error = chalk.bold.red;
console.log(error('Server has stopped crashed unexpectedly'));

const warning = chalk.keyword('orange');
console.log('Let me ' +  warning('warn') + ' you');

const people = 'world';
console.log(chalk`Hello {red.bold ${people}} !.`);
