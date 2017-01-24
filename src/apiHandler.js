const request = require("request");

var baseUrl = "http://manager.paragon.phineas.io/api/v1/";

var apiSet = {};

apiSet.token = function(callback) {
  request({
    uri: baseUrl + "getToken",
    method: 'GET',
    timeout: 1000
  }, function(err, res, body) {
    if(!err) {
      dataset = JSON.parse(body);

      callback(null, dataset.token);
    } else {
      callback(err, null);
    }
  });
}

module.exports = apiSet;
