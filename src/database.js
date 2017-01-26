const mongo = require("mongodb"),
  MongoClient = mongo.MongoClient,
  data = require("../data/keys.json"),
  mobject = require("mongodb").ObjectID,
  log = require("fancy-log");

var api = {};
var url = "mongodb://" + data.mongo.host + ":27017/" + data.mongo.database;


api.dbConnect = function() {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      log.error('Manager> Unable to connect to the mongoDB server. Error:', err);
    } else {
      log.info('Manager> Connection established to', url);

      api.dbC = db;
    }
  });
}

api.insert = function(db, collection, insertion) {
  var collection = db.collection(collection);

  collection.insert([insertion], function(err, res) {
    if (err) {
      log.error("Manager> mongoDB decided to fail on an insertion:", err);
    }
  });
}

api.update = function(db, collection, criteria, toUpdate) {
  var collection = db.collection(collection);

  collection.update(criteria, toUpdate, function(err, res) {
    if (err) {
      log.error("Manager> mongoDB decided to fail on an insertion:", err);
    }
  });
}

api.get = function(query, collection, callback) {
  db = api.dbC;
  var collection = db.collection(collection);

  collection.findOne(query, function(err, res) {
    if(!err) {
      callback(null, res);
    } else {
      callback(err, null);
    }
  });
}

module.exports = api;
