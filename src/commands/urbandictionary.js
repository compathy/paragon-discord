const request = require("request"),
      keys = require("../../data/keys.json");

var command = {};

command.dict = function(term, callback) {
  request({
    uri: "https://mashape-community-urban-dictionary.p.mashape.com/define?term=" + term,
    method: 'GET',
    headers: {
      'X-Mashape-Key': keys.mashape,
      'Accept': 'text/plain'
    },
    timeout: 3000
  }, function(err, res, body) {
    if(!err) {
      var dataset = JSON.parse(body);
      callback(null, dataset.list[0]);
    } else {
      callback(err, null)
      log.err("Mashape didn't want to repond to a request :/");
    }
  });
}

module.exports = command;
