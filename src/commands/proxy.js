const api = require("../apiHandler"),
    proxyInfo = require("../../data/proxy.json");

var command = {};

command.getProxy = function(callback) {
  api.proxy(proxyInfo.ip, function(res) {
    callback("Manager> This instance is currently on proxy ID " + res);
  });
}

module.exports = command;
