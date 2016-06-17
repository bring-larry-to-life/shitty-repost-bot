var jobs = require('./lib/jobs');
var reddit = require('./lib/reddit');

// required on raspberry pi to fix setInverval() problem
// https://github.com/nodejs/node/issues/4262
jobs.createJob('*/20 * * * *', function() {});

// repost every three hours
jobs.createJob('0 */3 * * *', function() {
	reddit.invokeRepost();
});
