/*
 * Provides various logging and error handling functions.
 */

var email = require('./email');

const LOG_TYPE = {
  LOG: 0,
  REPOST: 1,
  EMAIL: 2
}

var log = function(message, type = LOG_TYPE.LOG) {
  console.log(message);
  fileLog(message);
  switch(type) {
    case LOG_TYPE.LOG:
      emailLog(message);
      break;
    case LOG_TYPE.REPOST:
      emailRepost(message);
      break;
    case LOG_TYPE.EMAIL:
      break;
  }
}

var error = function(message, errorCode = -1, type = LOG_TYPE.LOG) {
  console.error(message, errorCode);
  fileError(message, errorCode);
  switch(type) {
    case LOG_TYPE.LOG:
    case LOG_TYPE.REPOST:
      emailError(message, errorCode);
      break;
    case LOG_TYPE.EMAIL:
      break;
  }
}

var fileLog = function(message) {
  // todo
}

var fileError = function(message, errorCode = -1) {
  // todo
}

var emailLog = function(message, subject = 'log') {
  email.sendMail(subject, message);
}

var emailError = function(message, errorCode = -1) {
  email.sendMail('error ' + errorCode, message);
}

// Create HTML body for successful repost email.
// postData = { id, subreddit, title, author, score, permalink }
var createRepostHTML = function(postData) {
  return "<a href='http://www.reddit.com/u/CIRCLJERK_REPOST_BOT'>/u/CIRCLJERK_REPOST_BOT</a> " +
    "has submitted a new repost at: " + new Date().toString() + "<br><br>Details:<br>" +
    "<ul>" +
      "<li><b>subreddit: </b>" + "<a href='http://www.reddit.com/r/" + postData.subreddit + "'>" + "/r/" + postData.subreddit + "</a></li>" +
      "<li><b>title: </b>" + postData.title + "</li>" +
      "<li><b>author: </b>" + "<a href='http://www.reddit.com/u/" + postData.author + "'>" + "/u/" + postData.author + "</a></li>" +
      "<li><b>original score: </b>" + postData.score + "</li>" +
      "<li><b>original link: </b>" + "<a href='http://www.reddit.com" + postData.permalink + "'>" + "http://www.reddit.com" + postData.permalink + "</a></li>" +
      "<li><b>new link: </b>" + "<a href='http://www.reddit.com/r/" + postData.subreddit + "/comments/" + postData.id + "'>" +  "http://www.reddit.com/r/" + postData.subreddit + "/comments/" + postData.id + "</a></li>" +
    "</ul>";
}

// postData = { id, subreddit, title, author, score, permalink }
var emailRepost = function(postData) {
  var subject = "Successful repost to /r/" + postData.subreddit + "!";
	var html = createRepostHTML(postData);
	email.sendMail(subject, html);
}

module.exports = {
  LOG_TYPE: LOG_TYPE,
  log: log,
  error: error
}
