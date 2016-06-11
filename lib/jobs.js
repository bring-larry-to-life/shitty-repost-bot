/*
 * A list of jobs that we always want our program to run.
 */

var CronJob = require('cron').CronJob;
var graph = require('./graph');

var jobs = [];

jobs.push({
  name: "Inspirational Quote",
  job: new CronJob('00 00 09 * * 1-5', function() {
    /*
     * Runs every weekday (Monday through Friday)
     * at 09:00:00 AM. It does not run on Saturday
     * or Sunday.
     */
     graph.postStatus('“Do not compare yourself to others. If you do so, you are insulting yourself.”');
    },
    null, /* This function is executed when the job stops */
    true /* Start the job right now */
  )
});

module.exports = jobs;
