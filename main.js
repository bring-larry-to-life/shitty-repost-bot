var jobs = require('./lib/jobs');

jobs.createDailyRandomlyTimedJob(9, 17, function() {
  console.log('TICKED!');
});
