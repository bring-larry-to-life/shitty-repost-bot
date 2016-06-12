/*
 * Create and keep track of CronJobs.
 */

var CronJob = require('cron').CronJob;

var idCounter = 0;
var jobs = {};

// Creates a CronJob.
var createJob = function(date, onTick) {
  var id = idCounter++;
  jobs[id] = new CronJob(date, function() {
    delete jobs[id];
    if(typeof onTick === 'function') {
      onTick();
    }
  }, null, true);
  jobs[id].id = id;
}

// Creates a daily CronJob based on a single start date object.
var createDailyJob = function(startDate, onTick) {
  createJob(startDate, function() {
    var tomorrow = new Date(startDate.toISOString());
    tomorrow.setDate(startDate.getDate() + 1);
    createDailyJob(tomorrow, onTick);
    onTick();
  });
}

// Returns a random integer between min (included) and max (included).
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
var getRandomIntInclusive = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns a Date object for tomorrow with a random time.
var getRandomTimeTomorrow = function(earliestHour = 0, latestHour = 23) {
  var date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(getRandomIntInclusive(earliestHour, latestHour));
  date.setMinutes(getRandomIntInclusive(0, 59));
  date.setSeconds(getRandomIntInclusive(0, 59));
  date.setMilliseconds(getRandomIntInclusive(0, 59));
  return date;
}

// Creates a daily cron job that occurs at a random time during the day.
// Only onTick is required.
var createDailyRandomlyTimedJob = function(earliestHour, latestHour, onTick) {
  var randomTimeTomorrow = getRandomTimeTomorrow(earliestHour, latestHour);
  createJob(randomTimeTomorrow, function() {
    createDailyRandomlyTimedJob(earliestHour, latestHour, onTick);
    onTick();
  });
}

// Returns an array of the CronJob objects.
var getJobs = function() {
  var jobsArray = [];
  for(var key in jobs) {
    // Skip loop if the property is from prototype.
    if(!jobs.hasOwnProperty(key)){
      continue;
    }
    jobsArray.push(jobs[key]);
  }
  return jobsArray;
}

// Stop a CronJob object and stop tracking it.
var killJob = function(job) {
  job.stop();
  // Remove from our jobs object.
  if(jobs[job.id]) {
      delete jobs[job.id];
  }
}

module.exports = {
  createJob: createJob,
  createDailyJob: createDailyJob,
  getRandomIntInclusive: getRandomIntInclusive,
  getRandomTimeTomorrow: getRandomTimeTomorrow,
  createDailyRandomlyTimedJob: createDailyRandomlyTimedJob,
  getJobs: getJobs,
  killJob: killJob
}
