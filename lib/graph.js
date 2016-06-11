var FB = require('fb');
var api = require('./api.json');

// set access token
FB.setAccessToken(api.ACCESS_TOKEN);

// make a simple request
function postStatus(body) {
  FB.api('me/feed', 'post', { message: body }, function (res) {
    if(!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    } else {
      console.log('Post Id: ' + res.id);
    }
  });
}

module.exports = {
  postStatus: postStatus
};
