/*
 * Interact with the Reddit API (using snoowrap wrapper).
 */

var snoo = require('./credentials');
var request = require('request');

const TIMEFRAMES = {
	ONE_HOUR: 3600,
	ONE_DAY: 86400,
	ONE_WEEK: 604800,
	ONE_YEAR: 31536000
}

// Return link to search results for top posts exactly one year ago.
var getUrl = function(timeframe = 3 * TIMEFRAMES.ONE_HOUR) {
	var currTime = Math.floor(Date.now() / 1000);
	var startTime = currTime - TIMEFRAMES.ONE_YEAR - timeframe;
	var endTime = currTime - TIMEFRAMES.ONE_YEAR;

	var url = "https://www.reddit.com/r/all/search?q=timestamp:"
	+ startTime
	+ ".."
	+ endTime
	+ "&sort=top&t=all&syntax=cloudsearch";

	return url;
}

// Get HTML content at a given URL.
var httpGet = function(url, callback) {
	request(url, function (error, response, body) {
		if (error || response.statusCode !== 200) {
			callback(error || {statusCode: response.statusCode});
		}
		callback(null, body);
	});
}

// Find the ID of the top post.
var scrapePostId = function(body) {
	var res = body.match(/\/comments\/(.*?)\//);
	return res[1];
}

// Collect title, URL/self-post text, and submit new post accordingly.
var resubmit = function(id) {
	snoo.r.get_submission(id).fetch().then(function(response) {
		var subreddit = response.subreddit.display_name;
		var title = response.title;
		var is_self = response.is_self;
		if (is_self) {
			var selftext = response.selftext;
			submitSelfPost(subreddit, title, selftext);
		} else {
			var url = response.url;
			submitLinkPost(subreddit, title, url);
		}
	}).catch(function(error) {
		console.log(error);
	});;
}

// Submit a self-post.
var submitSelfPost = function(subreddit, title, text) {
	snoo.r.get_subreddit(subreddit).submit_selfpost({
		title: title,
		text: text
	});
}

// Submit a link.
var submitLinkPost = function(subreddit, title, url) {
	snoo.r.get_subreddit(subreddit).submit_link({
		title: title,
		url: url
	});
}

// Invoke the resubmission.
var invokeRepost = function() {
	httpGet(getUrl(), function(error, body) {
		if (error) {
			console.log(error);
		} else {
			var id = scrapePostId(body);
			resubmit(id);
		}
	});
}

module.exports = {
	getUrl: getUrl,
	httpGet: httpGet,
	scrapePostId: scrapePostId,
	resubmit: resubmit,
	submitSelfPost: submitSelfPost,
	submitLinkPost: submitLinkPost,
	invokeRepost: invokeRepost
}
