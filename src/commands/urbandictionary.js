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
      if(dataset.list[0]) {
        if(dataset.list[0].definition.length < 1025 && dataset.list[0].example.length < 1025) {
          callback(null, dataset.list[0]);
        } else if (dataset.list[1] && dataset.list[1] < 1025) {
          callback(null, dataset.list[1]);
        } else {
          callback(null, [{"definition": "Too long to display :/", "example": "Too long to display :/", "permalink": "https://urbandictionary.com"}]);
        }
      } else {
        callback(null, {definition: "No definition to display...", example: "No example to display"});
      }
    } else {
      callback(err, null)
      log.err("Mashape didn't want to repond to a request :/");
    }
  });
}

module.exports = command;
