var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');

// every three hours
jobs.createJob('0 */3 * * *', function() {
	reddit.invokeRepost();
});
