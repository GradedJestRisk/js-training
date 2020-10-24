// https://github.com/kelektiv/node-cron
const dayjs = require('dayjs');
const CronJob = require('cron').CronJob
const parisTimezone = 'Europe/Paris';

//  ┌────────────── second (optional)
//  │ ┌──────────── minute
//  │ │ ┌────────── hour
//  │ │ │ ┌──────── day of month
//  │ │ │ │ ┌────── month
//  │ │ │ │ │ ┌──── day of week
//  │ │ │ │ │ │
//  │ │ │ │ │ │
//  * * * * * *

// Pattern doc => http://crontab.org/ or https://crontab.guru
// Note: this module has second granularity, whereas unix cron doesn't (so only 5 options)

const eachSecond    = ' * * * * * *';
const each5Seconds  = ' */5 * * * * *';
const eachSecond5   = '5 * * * * *';

const timeFormat = 'HH:mm:ss';

// API here => https://github.com/kelektiv/node-cron#api
const cron1 = new CronJob(eachSecond, function () {
    const now = dayjs().format(timeFormat);
    console.log(now + ': I am cron1, scheduled each second - ' + eachSecond)
}, null, true, parisTimezone);

const cron2 = new CronJob(each5Seconds, function () {
    console.log('I am cron2, scheduled each 5s - ' + each5Seconds)
}, null, true, parisTimezone);

const cron3 = new CronJob(eachSecond5, function () {
    console.log('I am cron3, scheduled each each ** h ** min 05s - ' + eachSecond5 )
}, null, true, parisTimezone);

