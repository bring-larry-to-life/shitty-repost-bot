var jobs = require('./lib/jobs');
var repost = require('./lib/reddit');

jobs.createDailyRandomlyTimedJob(9, 17, function() {
	repost.invokeRepost();
});
