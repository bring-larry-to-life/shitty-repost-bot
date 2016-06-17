/*
 * Interact with the Reddit API (using snoowrap wrapper).
 */

var request = require('request');
var snoowrap = require('snoowrap');
var reddit_credentials = require('./credentials').reddit_credentials;

var snoo = new snoowrap({
  client_id: reddit_credentials.CLIENT_ID,
  client_secret: reddit_credentials.CLIENT_SECRET,
  refresh_token: reddit_credentials.REFRESH_TOKEN,
  user_agent: reddit_credentials.USER_AGENT
});

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

	var url = "https://www.reddit.com/r/all/search?q=timestamp:" +
		startTime + ".." + endTime + "&sort=top&t=all&syntax=cloudsearch";

	return url;
}

// Get HTML content at a given URL.
var httpGet = function(url, callback) {
	request(url, function (error, response, body) {
		if (error || response.statusCode !== 200) {
			return callback(error || {statusCode: response.statusCode});
		}
		callback(undefined, body);
	});
}

// Find the ID of the top post.
var scrapePostId = function(body) {
	var res = body.match(/\/comments\/(.*?)\//);
	return res[1];
}

// Collect title, URL/self-post text, and submit new post accordingly.
var resubmit = function(id, callback) {
	snoo.get_submission(id).fetch().then(function(response) {
    var postData = {
      subreddit: response.subreddit.display_name,
      title: response.title,
      author: response.author.name,
      score: response.score,
      permalink: response.permalink
    }
		if (response.is_self) {
			var selftext = response.selftext;
			submitSelfPost(postData.subreddit, postData.title, selftext, function(error, id) {
        postData.id = id;
        callback(error, postData);
      });
		} else {
			var url = response.url;
			submitLinkPost(postData.subreddit, postData.title, url, function(error, id) {
        postData.id = id;
        callback(error, postData);
      });
		}
	}).catch(callback);
}

// Submit a self-post.
var submitSelfPost = function(subreddit, title, text, callback) {
	snoo.get_subreddit(subreddit).submit_selfpost({
		title: title,
		text: text
	}).then(function(response) {
		var id = response.name.substring(3);
    callback(undefined, id);
	}).catch(callback);
}

// Submit a link.
var submitLinkPost = function(subreddit, title, url, callback) {
	snoo.get_subreddit(subreddit).submit_link({
		title: title,
		url: url
	}).then(function(response) {
		var id = response.name.substring(3);
    callback(undefined, id);
	}).catch(callback);
}

// Invoke the resubmission.
var invokeRepost = function(timeframe, callback) {
	httpGet(getUrl(timeframe), function(error, body) {
		if (error) {
			callback(error);
		} else {
			var id = scrapePostId(body);
			resubmit(id, callback);
		}
	});
}

module.exports = {
	TIMEFRAMES: TIMEFRAMES,
	getUrl: getUrl,
	httpGet: httpGet,
	scrapePostId: scrapePostId,
	resubmit: resubmit,
	submitSelfPost: submitSelfPost,
	submitLinkPost: submitLinkPost,
	invokeRepost: invokeRepost
}
