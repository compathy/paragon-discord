const Discord = require("discord.js"),
      log = require("fancy-log"),
      api = require("./apiHandler"),
      proxyInfo = require("../data/proxy.json")
      commander = require("./commands/commander"),
      toobusy = require("toobusy-js"),
      elm = require("event-loop-monitor"),
      colors = require("colors");
      parasphere = new Discord.Client();

log.info('Paragon> Preparing bot...');

parasphere.on('ready', () => {
  parasphere.started = new Date();

  elm.resume();

  api.addProxy(proxyInfo.ip, proxyInfo.port);
  log.info('Connected to ' + parasphere.guilds.size + ' guilds');

  log.info('Paragon> Started Parasphere proxy');
});

let trigger = ">";

parasphere.on('message', msg => {
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
      return;
    }
    parasphere.login(res);
});
