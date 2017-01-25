const Discord = require("discord.js"),
      log = require("fancy-log"),
      api = require("./apiHandler"),
      proxyInfo = require("../data/proxy.json")
      commander = require("./commands/commander");
const parasphere = new Discord.Client();

parasphere.on('ready', () => {
  log.info('Paragon> Preparing bot...');
  parasphere.started = new Date();

  api.addProxy(proxyInfo.ip, proxyInfo.port);

  var finished = new Date();
  log.info('Paragon> Started ${parasphere.user.username}! in ' + finished - parasphere.started + 'ms');
});

let trigger = ">";

parasphere.on('message', msg => {
  if(!msg.content.startsWith(trigger)) return;

  let cmdFormd = msg.content.split(" ");
  var inr = commander.commands.indexOf(cmdFormd[0].replace(/>/g, ''));
  if(inr == -1) {
    msg.channel.sendMessage(msg.author + " Command not found! Use >help for a list of commands.");
    console.log(cmdFormd[0].replace(/>/g, ''));
    return;
  } else {
    handleCommand(cmdFormd, msg.author, msg.channel);
  }
});

api.token(function(err, res) {
    if(err) {
      log.error('Could not get login token from API');
      return;
    }
    parasphere.login(res);
});

//Commands:
const proxyCommand = require("./commands/proxy");

function handleCommand(cray, user, channel) {
  let cmdToHandle = cray[0].replace(/>/g, '');

  switch(cmdToHandle) {
    case 'help':
      commander.getHelp(function(res) {
        channel.sendMessage(user + " " + res);
      });
      break;
    case 'proxy':
      proxyCommand.getProxy(function(res) {
        channel.sendMessage(user + " " + res);
      });
    break;
    default:
      channel.sendMessage("Paragon> ?! Command error...")
      break;
  }
}
