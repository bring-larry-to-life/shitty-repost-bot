/*
 * Sends emails.
 */

var nodemailer = require('nodemailer');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
var logger = require('./logger');
var email_credentials = require('./credentials').email_credentials;
var EMAIL_LIST = require('./credentials').EMAIL_LIST;

// Create reusable transporter object using the default SMTP transport.
var transporter = nodemailer.createTransport(email_credentials.TRANSPORTER);
transporter.use('compile', htmlToText());

var isObject = function(data) {
  if (data !== null && typeof data === 'object') {
    return true;
  }
  return false;
}

// receivers: a string list of recievers
//   example: 'bar@blurdybloop.com, baz@blurdybloop.com'
var mailOptionsFactory = function(subject, body, receivers = EMAIL_LIST) {
  return {
    from: '"' + email_credentials.NAME + '" <' + email_credentials.ADDRESS + '>',
    to: receivers,
    subject: subject,
    html: isObject(body) ? JSON.stringify(body) : body
  }
}

// Send mail with defined transport object.
var sendMail = function(subject, body, recievers) {
  var mailOptions = mailOptionsFactory(subject, body, recievers);
  transporter.sendMail(mailOptions, function(error, info) {
    // TODO: For some reason when created outside of sendMail(), logger = {}.
    var logger = require('./logger');
    if (error) {
      return logger.error(error, -1, logger.LOG_TYPE.EMAIL);
    }
    logger.log('Message sent: ' + info.response, logger.LOG_TYPE.EMAIL);
  });
}

module.exports = {
  sendMail: sendMail
}
