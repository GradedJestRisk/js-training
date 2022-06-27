const progress = require('progress-stream');
const req = require('request');
const fs = require('fs');

const oneSecond = 1000;
const reportingInterval = oneSecond
const str = progress({
   time: reportingInterval
});

str.on('progress', function(progress) {
   // console.log(Math.round(progress.percentage)+'%');
   // console.log(progress);
   console.log(`${progress.transferred} bytes received`);
});

req('http://cachefly.cachefly.net/100mb.test', { headers: { 'user-agent': 'test' }})
   .pipe(str)
   .pipe(fs.createWriteStream('test.data'));
