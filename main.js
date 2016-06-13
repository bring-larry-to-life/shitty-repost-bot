var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');

// hourly
jobs.createJob('0 */3 * * *', function() {
	reddit.invokeRepost();
});
