/*
 * Provides various logging and error handling functions.
 */

var email = require('./email');

var log = function(message) {
  console.log(message);
  fileLog(message);
  emailLog(message);
}

var error = function(message, errorCode = -1) {
  console.error(message, errorCode);
  fileError(message, errorCode);
  emailError(message, errorCode);
}

var fileLog = function(message) {
  // todo
}

var fileError = function(message, errorCode = -1) {
  // todo
}

var emailLog = function(message) {
  email.sendMail('log', message);
}

var emailError = function(message, errorCode = -1) {
  email.sendMail('error ' + errorCode, message);
}

module.exports = {
  log: log,
  error: error,
  fileLog: fileLog,
  fileError: fileError
}
