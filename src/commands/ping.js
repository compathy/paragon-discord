const tcpp = require('tcp-ping'),
      async = require('async');

var command = {};

command.getPingRespMsg = function() {
return new Promise(function(resolve, reject) {
  var pingd = [];

  getPings(function(err, res) {
    pingd.push(":cloud: Google Cloud API Latency: " + res[0]);
    pingd.push(":control_knobs: Google Compute Engine (Paragon) Latency: " + res[1]);
    pingd.push(":level_slider: Paragon API & Database (mongo) Latency: " + res[2]);
    pingd.push(":book: Mashape (Urban) API Latency: " + res[3]);
    pingd.push(":wolf: Wolfram API Latency: " + res[4] + "ms");

    resolve(pingd.join("ms\n"));
  });

  getPings(function(err, res) {
    console.log(res);
  });

  //console.log(pingd);
});
}

function getPing(server, port, callback) {
  return function(callback) {
    tcpp.ping({address: 'googleapis.com', port: 80, attempts: 3}, function(err, res) {
      callback(err, parseFloat(res.min).toFixed(2));
    }); 
  }
}

function getPings(callback) {
  async.series([
    getPing("googleapis.com", 80),
    getPing("cloud.phineas.io", 80),
    getPing("127.0.0.1", 27018),
    getPing("galileo.mashape.com", 80),
    getPing("api.wolframalpha.com", 80)
  ], function(err, res) {
    console.log(res);
    callback(err, res);
  });
}
module.exports = command;
