const request = require("request");

var command = {};

command.getInfo = function(host, callback) {
  request({
    uri: "http://ip-api.com/json/" + host,
    method: 'GET',
    timeout: 3000
  }, function(err, res, body) {
    if(!err) {
      console.log(host);
      var dataset = JSON.parse(body);
      callback(null, dataset);
    } else {
      callback(err, null);
      console.error(err);
      console.error("ip-api.com didn't want to repond to a request :/");
    }
  });
}

module.exports = command;
