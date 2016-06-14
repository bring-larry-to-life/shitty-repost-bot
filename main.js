var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');

// every three hours
jobs.createJob('31 * * * *', function() {
	console.log('Job executing at: ' + new Date().toString());
	reddit.invokeRepost();
});
