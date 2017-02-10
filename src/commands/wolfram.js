var request = require("request"),
    keys = require("../../data/keys.json");

var command = {};

command.getComputedWolfram = function(query, callback) {
  request({
    uri: "https://api.wolframalpha.com/v1/result?i=" + query + "&appid=" + keys.wolfram,
    method: 'GET',
    timeout: 3000
  }, function(err, res, body) {
    if(!err) {
      console.log("https://api.wolframalpha.com/v1/result?i=" + query + "&appid=" + keys.wolfram);
      callback(null, body);
    } else {
      callback(err, null);
    }
  });
}

module.exports = command;
