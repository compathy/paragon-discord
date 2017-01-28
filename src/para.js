const Discord = require("discord.js"),
      log = require("fancy-log"),
      api = require("./apiHandler"),
      proxyInfo = require("../data/proxy.json")
      commander = require("./commands/commander"),
      toobusy = require("toobusy-js"),
      elm = require("event-loop-monitor"),
      colors = require("colors"),
      dbApi = require("./database"),
      mobject = require("mongodb").ObjectID,
      nodeCache = require("node-cache");
      parasphere = new Discord.Client();

log.info('Paragon> Preparing bot...');

//const global.parallax = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

let internalIP = require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    return add;
});

parasphere.on('ready', () => {
  parasphere.started = new Date();

  elm.resume();

  dbApi.dbConnect(function(db) {
    var launchsn = {instanceIP: internalIP, currStatus: parasphere.status, guilds: parasphere.guilds.size, readyAt: parasphere.readyAt};
    dbApi.insert(db, 'instanceLaunches', launchsn);
    log.info('Manager> Inserted instance launch doc..');
  });

  api.addProxy(proxyInfo.ip, proxyInfo.port);
  log.info('Connected to ' + parasphere.guilds.size + ' guilds');

  log.info('Paragon> Started Parasphere proxy');
});

let trigger = ">";

parasphere.on('message', msg => {
  if(parasphere.status != 0) return;
  var messagesn = {messageID: msg.id, userID: msg.author.id, channelID: msg.channel.id, serverID: msg.guild.id, message: msg.content, timestamp: new Date().getTime()};
  dbApi.insert(dbApi.dbC, 'messages', messagesn);

  if(!msg.content.startsWith(trigger)) return;

  if(toobusy()) {
    msg.channel.sendMessage("Manager> Under heavy traffic, unable to serve request. :/");
    return;
  }

  let cmdFormd = msg.content.split(" ");
  var inr = commander.commands.indexOf(cmdFormd[0].replace(/>/g, ''));
  if(inr == -1) {
    msg.channel.sendMessage(msg.author + " Command not found! Use >help for a list of commands.");
    return;
  } else {
    commander.handleCommand(cmdFormd, msg.author, msg.channel);
  }
});

parasphere.on('guildCreate', gc => {
  dbApi.get({guildID: gc.id}, 'guilds', function(err, res) {
    if(!err) {
      if(!res) {
        var guildsn = {guildID: gc.id, guildName: gc.name, guildRegion: gc.region, owner: gc.owner.id, membersCount: gc.memberCount, addedAt: gc.joinedAt, inCord: true};
        dbApi.insert(db.dbC, 'guilds', guildsn);

        log.info("Guilds> Added to guild", gc.name);
      } else {
        dbApi.update(dbApi.dbC, 'guilds', {guildID: gc.id}, {$set: {guildID: gc.id, guildName: gc.name, guildRegion: gc.region, owner: gc.owner.id, membersCount: gc.memberCount, addedBackAt: new Date(), inCord: true}});

        log.info("Guilds> Added back to guild", gc.name);
      }
    }
  });
});

parasphere.on('guildMemberAdd', gc => {
  dbApi.update(dbApi.dbC, 'guilds', {guildID: gc.id}, {$set: {membersCount: gc.memberCount}});

  log.info("Guilds> A member was added to", gc.name);
});

parasphere.on('guildMemberRemove', gc => {
  dbApi.update(dbApi.dbC, 'guilds', {guildID: gc.id}, {$set: {membersCount: gc.memberCount}});

  log.info("Guilds> A member was removed from", gc.name);
});

parasphere.on('guildUpdate', function(og, gc) {
  var updatesn = {$set: {guildID: gc.id, guildName: gc.name, guildRegion: gc.region, owner: gc.owner.id}};
  var idObj = {guildID: gc.id};
  dbApi.update(dbApi.dbC, 'guilds', idObj, updatesn);
});

parasphere.on('guildDelete', gc => {
  var idObj = {guildID: gc.id};
  dbApi.update(dbApi.dbC, 'guilds', idObj, {$set: {inCord: false}});

  log.info("Guilds> The", gc.name, "Guild was deleted or Paragon was ejected! ):")
});

parasphere.on('error', err => {
  log.error("Manager> Encountered (SERIOUS) connection error...".red, err);
});

elm.on('data', latency => {
  if(latency.p50 >= 1350) {
    log.warn("Latency gauge above limit -> ".yellow + latency.p50);
  } else {
    log.info("Latency -> ".magenta + latency.p50);
  }
});
