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

module.exports = {
  sendMail: sendMail
}
