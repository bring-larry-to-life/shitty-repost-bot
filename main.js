var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');
var logger = require('./lib/logger');

// required on raspberry pi to fix setInverval() problem
// https://github.com/nodejs/node/issues/4262
jobs.createJob('*/20 * * * *', function() {});

// repost every hour
jobs.createJob('0 * * * *', function() {
	logger.log('Job executing at: ' + new Date().toString());
	reddit.invokeRepost(reddit.TIMEFRAMES.ONE_HOUR);
});
