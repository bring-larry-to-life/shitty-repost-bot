/*
 * Interact with the Reddit API (using snoowrap wrapper).
 */

var snoo = require('./credentials');
var request = require('request');

// Return link to search results for top posts exactly one year ago.
var getUrl = function() {
	var currTime = Math.floor(Date.now() / 1000);
	var startTime = currTime - 31536000 - 86400;
	var endTime = currTime - 31536000;

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
			return callback(error || {statusCode: response.statusCode});
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
	});
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
	httpGet(getUrl(), function(err, body) {
		if (err) {
			console.log(err);
		} else {
			var id = scrapePostId(body);
			resubmit(id);
		}
	});
}
