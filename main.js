var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');

// hourly
jobs.createJob('0 * * * *', function() {
	reddit.invokeRepost();
});
