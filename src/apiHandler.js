const request = require("request"),
      log = require("fancy-log");

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

apiSet.addProxy = function(ip, port) {
  const params = JSON.stringify({
    hostAddr: ip,
    hostPort: port
  });

  request({
    uri: baseUrl + "addNode",
    method: 'POST',
    body: params
  }, function(err, res, body) {
    if(!err) {
      dataset = JSON.parse(body);

      log.info("Added proxy " + id + "! This proxy has been assigned token: " + dataset.proxyToken);
    } else {
      log.error("Failed to add proxy " + ip);
    }
  });
}

apiSet.proxy = function(ip, callback) {
  request({
    uri: baseUrl + "getProxyFromIP",
    method: 'GET',
    headers: {
      'X-Forwarded-For': ip
    },
    timeout: 1000
  }, function(err, res, body) {
    if(!err) {
      dataset = JSON.parse(body);

      callback(null, dataset.proxyID);
    } else {
      callback(err, null);
    }
  });
}

module.exports = apiSet;
