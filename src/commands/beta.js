const dbApi = require("../database.js"),
  async = require("async");

var command = {};

command.addTester = function(userid, callback) {
  dbApi.get({
    userID: userid
  }, 'betalease', function(err, res) {
    if (!err) {
      if (!res) {
        var betasn = {
          userID: userid,
          added: new Date().getTime(),
          tester: true
        };
        dbApi.insert(dbApi.dbC, 'betalease', betasn);
        callback(null, {
          success: true,
          new: true
        });
      } else if (res.tester) {
        callback(null, {
          success: true,
          alreadyTester: true
        });
      } else {
        var betasn = {
          $set: {
            tester: true,
            addedBack: new Date().getTime()
          }
        };
        dbApi.update(dbApi.dbC, 'betalease', {
          userID: userid
        }, betasn);
        callback(null, {
          success: true,
          new: false
        });
      }
    } else {
      callback(err, {
        success: false
      });
    }
  });
}

command.removeTester = function(userid, callback) {
  dbApi.get({
    userID: userid
  }, 'betalease', function(err, res) {
    if (!err) {
      if (!res.tester) {
        callback(null, {
          indb: true
        });
      } else {
        var betasn = {
          $set: {
            tester: false,
            removed: new Date().getTime()
          }
        };
        dbApi.update(dbApi.dbC, 'betalease', {
          userID: userid
        }, betasn);
        callback(null, {
          success: true
        });
      }
    } else {
      callback(err, {
        success: false
      });
    }
  });
}

command.getTesters = function(callback) {
  dbApi.getAll({
    tester: true
  }, 'betalease', function(err, res) {
    if (!err) {
      callback(null, res);
    } else {
      callback(err, null);
    }
  });
}

module.exports = command;
