var dbApi = require("../database.js");

var command = {};

command.getMessages = function(callback) {
  dbApi.count({})
}
