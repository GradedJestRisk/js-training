const bunyan = require('bunyan');
const loggedApplicationName = 'js-training';
const isTest = process.env.NODE_ENV;

const logger = bunyan.createLogger({
   name: loggedApplicationName,
   stream: process.stdout,
   level: isTest === 'test' ? 'fatal' : 'info'
});

module.exports = logger;
