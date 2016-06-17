var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');
var logger = require('./lib/logger');

// required on raspberry pi to fix setInverval() problem
// https://github.com/nodejs/node/issues/4262
jobs.createJob('*/20 * * * *', function() {});

// repost every three hours
jobs.createJob('0 */3 * * *', function() {
	reddit.invokeRepost(undefined, function(error, postData) {
		if (error) {
			logger.error(error, -1, logger.LOG_TYPE.REPOST);
		} else {
			logger.log(postData, logger.LOG_TYPE.REPOST);
		}
	});
});
