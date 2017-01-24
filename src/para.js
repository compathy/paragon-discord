const Discord = require("discord.js"),
      log = require("fancy-log"),
      api = require("./apiHandler");
const client = new Discord.Client();

client.on('ready', () => {
  log.info(`ParagonBot ${client.user.username}!`);
});

api.token(function(err, res) {
    if(err) {
      log.error('Could not get login token from API');
      return;
    }
    client.login(res);
});
