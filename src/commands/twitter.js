var Twitter = require("twitter"),
    keys = require("../../data/keys.json").twitter;

var command = {};

var twClient = new Twitter({
  consumer_key: keys.consumerKey,
  consumer_secret: keys.consumerSecret,
  bearer_token: keys.bearer
});

command.userInfo = function(username, callback) {
  twClient.get('users/show', {screen_name: username}, function(err, body, res) {
    if(!err) {
        callback(null, body);
    } else {
        callback(err, null);
    }
  });
}

command.invalidateBeare = function(callback) {
  twClient.post('oauth2/invalidate_token', {access_token: keys.bearer}, function(err, body, res) {
    if(!err) {
      callback(null, body);
    } else {
      callback(err, null);
    }
  });
}

module.exports = command;
