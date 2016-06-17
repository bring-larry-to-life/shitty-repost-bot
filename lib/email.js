var nodemailer = require('nodemailer');
var logger = require('./logger');
var email_credentials = require('./credentials').email_credentials;
var EMAIL_LIST = require('./credentials').EMAIL_LIST;

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(email_credentials.TRANSPORTER);

// receivers: a string list of recievers
//   example: 'bar@blurdybloop.com, baz@blurdybloop.com'
var mailOptionsFactory = function(subject, text, receivers = EMAIL_LIST) {
  return {
    from: '"' + email_credentials.NAME + '" <' + email_credentials.ADDRESS + '>',
    to: receivers,
    subject: subject,
    text: text,
    html: '<b>' + text + '</b>'
  }
}

// send mail with defined transport object
var sendMail = function(subject, text, recievers) {
  var mailOptions = mailOptionsFactory(subject, text, recievers);
  transporter.sendMail(mailOptions, function(error, info) {
    // TODO: for some reason when created outside of sendMail(), logger = {}
    var logger = require('./logger');
    if(error) {
      return logger.fileError('error');
    }
    logger.fileLog('Message sent: ' + info.response);
  });
}

// create HTML body for successful repost email
var createRepostMessage = function(id, subreddit, title, author, score, permalink) {
  return "<a href='http://www.reddit.com/u/CIRCLJERK_REPOST_BOT'>/u/CIRCLJERK_REPOST_BOT</a> has submitted a new repost at: " + 
  new Date().toString() + 
  "<br><br>Details:<br>" + 
  "<ul>" + 
  "<li><b>subreddit: </b>" + "<a href='http://www.reddit.com/r/" + subreddit + "'>" + "/r/" + subreddit + "</a></li>" + 
  "<li><b>title: </b>" + title + "</li>" +
  "<li><b>author: </b>" + "<a href='http://www.reddit.com/u/" + author + "'>" + "/u/" + author + "</a></li>" +
  "<li><b>original score: </b>" + score + "</li>" +
  "<li><b>original link: </b>" + "<a href='http://www.reddit.com" + permalink + "'>" + "http://www.reddit.com" + permalink + "</a></li>" +
  "<li><b>new link: </b>" + "<a href='http://www.reddit.com/r/" + subreddit + "/comments/" + id + "'>" +  "http://www.reddit.com/r/" + subreddit + "/comments/" + id + "</a></li>" +
  "</ul>";
}

// create subject for successful repost email
var createRepostSubject = function(subreddit) {
  return "Successful repost to /r/" + subreddit + "!";
}

module.exports = {
  sendMail: sendMail,
  createRepostMessage: createRepostMessage,
  createRepostSubject: createRepostSubject
}
