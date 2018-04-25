const schedule = require('node-schedule')

let scheduleFetchPrice = schedule.scheduleJob(` ${config.get("SCHEDULE.SECOND")} 
                                                ${config.get("SCHEDULE.MINUTE")} 
                                                ${config.get("SCHEDULE.HOUR")} 
                                                ${config.get("SCHEDULE.DAYOFMONTH")} 
                                                ${config.get("SCHEDULE.MONTH")} 
                                                ${config.get("SCHEDULE.DAYOFWEEK")}`, function () {
  console.log(`Test scheduler`)
})