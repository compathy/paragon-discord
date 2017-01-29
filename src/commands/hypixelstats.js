const request = require("request"),
  keys = require("../../data/keys"),
  log = require("fancy-log");

var command = {};

command.getStats = function(username, callback) {
  request({
    uri: "https://api.hypixel.net/player?key=" + keys.hypixel + "&name=" + username,
    method: 'GET',
    timeout: 3000
  }, function(err, res, body) {
    if (!err) {
      var dataset = JSON.parse(body);
      if (dataset.success) {
        callback(null, dataset);
      } else {
        callback(null, JSON.parse({
          success: false
        }));
      }
    } else {
      callback(err, null);
      log.err("Hypixel decided to fail on an API request :/");
    }
  });
}

module.exports = command;
