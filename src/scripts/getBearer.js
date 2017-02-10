//Use this to gen a bearer token used for the twitter cmd	

const request = require('request'),
      config = require('../../data/keys.json').twitter;

var consumer_key = config.consumerKey,
    consumer_secret = config.consumerSecret;
var enc_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');

var oauthOptions = {
  url: 'https://api.twitter.com/oauth2/token',
  headers: {'Authorization': 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
  body: 'grant_type=client_credentials'
};

request.post(oauthOptions, function(e, r, body) {
  console.log(body)
});
