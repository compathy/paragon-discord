const Discord = require("discord.js"),
      log = require("fancy-log"),
      api = require("./apiHandler"),
      commander = require("./commands/commander");
const client = new Discord.Client();

let trigger = ">";

client.on('message', msg => {
  if(!msg.content.startsWith(trigger)) return;

  let cmdFormd = msg.content.split(" ");
  if(!cmdFormd[0].replace(/>/g, '').indexOf(commander.commands)) {
    msg.channel.sendMessage(msg.sender + "Command not found! Use >help for a list of commands.");
    return;
  } else {
    handleCommand(cmdFormd, msg.author, function(err, res) {
       //stuff
    });
  }
});

client.on('ready', () => {
  log.info('Paragon> Preparing bot...');
  bot.started = new Date();

  var finished = new Date();
  log.info('Paragon> Started ${client.user.username}! in ' + bot.started - finished + 'ms');
});

api.token(function(err, res) {
    if(err) {
      log.error('Could not get login token from API');
      return;
    }
    client.login(res);
});

function handleCommand(cray, user, callback) {
  let cmdToHandle = cray[0].replace(/>/g, '');

  //TODO: initiate cmds
  switch(cmdToHandle) {
    case 'help':
      break;
    default:
      break;
  }
}
