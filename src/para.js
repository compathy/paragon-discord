const Discord = require("discord.js"),
      log = require("fancy-log"),
      api = require("./apiHandler"),
      proxyInfo = require("../data/proxy.json")
      commander = require("./commands/commander"),
      toobusy = require("toobusy-js"),
      elm = require("event-loop-monitor"),
      colors = require("colors"),
      dbApi = require("./database"),
      mobject = require("mongodb").ObjectID;
      parasphere = new Discord.Client();

log.info('Paragon> Preparing bot...');

parasphere.on('ready', () => {
  parasphere.started = new Date();

  elm.resume();

  dbApi.dbConnect();

  api.addProxy(proxyInfo.ip, proxyInfo.port);
  log.info('Connected to ' + parasphere.guilds.size + ' guilds');

  log.info('Paragon> Started Parasphere proxy');
});

let trigger = ">";

parasphere.on('message', msg => {
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
  var guildsn = {guildID: gc.id, guildName: gc.name, guildRegion: gc.region, owner: gc.owner.id, membersCount: gc.memberCount, addedAt: gc.joinedAt, inCord: true};
  dbApi.insert(db.dbC, 'guilds', guildsn);

  log.info("Guilds> Added to guild", gc.name);
});

parasphere.on('guildMemberAdd', gc => {
  dbApi.update(db.dbC, 'guilds', {guildID: gc.id}, {$set: {membersCount: gc.memberCount}});

  log.info("Guilds> A member was added to", gc.name);
});

parasphere.on('guildMemberRemove', gc => {
  dbApi.update(db.dbC, 'guilds', {guildID: gc.id}, {$set: {membersCount: gc.memberCount}});

  log.info("Guilds> A member was removed from", gc.name);
});

parasphere.on('guildUpdate', gc => {
  var updatesn = {guildID: gc.id, guildName: gc.name, guildRegion: gc.region, owner: gc.owner.id};
  var idObj = {_id: {guildID: gc.id}};
  dbApi.update(dbApi.dbC, 'guilds', idObj, updatesn);
});

parasphere.on('guildDelete', gc => {
  var idObj = {_id: {guildID: gc.id}};
  dbApi.update(db.dbC, 'guilds', idObj, {inCord: false});

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

api.token(function(err, res) {
    if(err) {
      log.error('Could not get login token from API'.red);
      return
    }
    parasphere.login(res);
});
