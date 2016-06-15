/*
 * Provides various logging and error handling functions.
 */

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
  // todo
}

var emailError = function(message, errorCode = -1) {
  // todo
}

module.exports = {
  log: log,
  error: error
}
