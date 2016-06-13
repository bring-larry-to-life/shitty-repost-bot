var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');

jobs.createDailyRandomlyTimedJob(9, 17, function() {
	reddit.invokeRepost();
});
