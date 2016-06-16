var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');
var logger = require('./lib/logger');

// every hour
jobs.createJob('0 * * * *', function() {
	logger.log('Job executing at: ' + new Date().toString());
	reddit.invokeRepost(reddit.TIMEFRAMES.ONE_HOUR);
});
