// https://github.com/kelektiv/node-cron
const dayjs = require('dayjs')
const CronJob = require('cron').CronJob
const parisTimezone = 'Europe/Paris'

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

const eachSecond = '* * * * * *'
const each5Seconds = '*/5 * * * * *'
const eachSecond5 = '5 * * * * *'
const eachSecondOnWeekDays = '* * * 1,2,3,4,5 * *'
const eachMinuteThreeOnWeekDays = '* 3 * 1,2,3,4,5 * *'
const each14h35OnWeekDays = '0 35 14 1,2,3,4,5 * *'

const timeFormat = 'HH:mm:ss'

const scheduleTask = ({
   schedule,
   task
}) => {
   new CronJob({
      cronTime: schedule,
      onTick: task,
      onComplete: null,
      start: true,
      timezone: parisTimezone
   })
}

API here => https://github.com/kelektiv/node-cron#api
const cron1 = new CronJob(eachSecond, function () {
   const now = dayjs().format(timeFormat)
   console.log(now + ': I am cron1, scheduled each second - - pattern is:' + eachSecond)
}, null, true, parisTimezone)

const cron2 = new CronJob(each5Seconds, function () {
   console.log('I am cron2, scheduled each 5s - pattern is:' + each5Seconds)
}, null, true, parisTimezone)

const cron3 = new CronJob(eachSecond5, function () {
   console.log('I am cron3, scheduled each ** h ** min 05s - pattern is: ' + eachSecond5)
}, null, true, parisTimezone)

const cron4 = new CronJob(eachSecondOnWeekDays, function () {
   console.log('I am cron4, scheduled each second on week days - pattern is: ' + eachSecondOnWeekDays)
}, null, true, parisTimezone)

const cron5 = new CronJob(each14h35OnWeekDays, function () {
   console.log('I am cron5, scheduled on 14h35m00s on week days - pattern is: ' + each14h35OnWeekDays)
}, null, true, parisTimezone)

scheduleTask({
   schedule: eachSecond,
   task: () => {
      console.log('I am cron1B, scheduled each second also')
   }
})
