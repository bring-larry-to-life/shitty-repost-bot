var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');
var logger = require('./lib/logger');

// every three hours
jobs.createJob('0 */3 * * *', function() {
	logger.log('Job executing at: ' + new Date().toString());
	reddit.invokeRepost();
});
