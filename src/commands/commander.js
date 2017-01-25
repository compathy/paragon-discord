const Discord = require("discord.js");

var manager = {};

manager.commands = ['help', 'info', 'invite', 'proxy', 'mcserver', 'hypixelstats', 'urbandictionary', '8ball'];
manager.generalCommands = ['help', 'info', 'invite', 'proxy', 'urbandictionary', '8ball'];
manager.minecraftCommands = ['mcserver', 'hypixelstats'];

manager.getHelp = function(callback) {
  var embedded = new Discord.RichEmbed().setTitle("-=-=-=-=-= Help =-=-=-=-=-").setColor("#90B5CA");

  embedded.addField("***-> General***", manager.generalCommands.join(", ")).addField("***-> Minecraft***", manager.minecraftCommands.join(", "));

  callback(embedded);
}

//Commands:
const proxyCommand = require("./proxy");
const urbandictionaryCommand = require("./urbandictionary");
const utils = require("mc-utils");
const ballCommand = require("./8ball");

manager.handleCommand = function(cray, user, channel) {
  let cmdToHandle = cray[0].replace(/>/g, '');

  switch(cmdToHandle) {
    case 'help':
      commander.getHelp(function(res) {
        channel.sendEmbed(res);
      });
      break;
    case 'proxy':
      proxyCommand.getProxy(function(res) {
        channel.sendMessage(user + " " + res);
      });
      break;
    case 'urbandictionary':
      if(cray.length == 1) {
        channel.sendMessage(user + " Command> Please specify a term to search!\n EG: `#urbandictionary phineas`")
      } else {
        let searchTerm = cray.slice(1, cray.length);
        let udSearchTerm = cray.slice(1, cray.length).join("+");

        urbandictionaryCommand.dict(searchTerm, function(err, res) {
          if(!err) {
            if(res) {
              var embedded = new Discord.RichEmbed().setTitle(" **<Urban Dictionary - " + searchTerm.join(" ") + "`>**").setColor("#EFFF00");
              embedded.addField("Definition", res.definition).addField("Example", res.example).setURL(res.permalink);
              channel.sendEmbed(embedded);
            } else {
              channel.sendMessage("Urban> No results for ``\"" + searchTerm.join(" ") + "\"`");
            }
          } else {
            channel.sendMessage("Manager> Unable to fetch information...");
          }
        });
      }
      break;
    case 'mcserver':
      if(cray.length == 1) {
        channel.sendMessage(user + " Command> Please specify a term to search!\n EG: `#mcserver mc.hypixel.net`")
      } else {
        let ipSearch = cray[1];
        var ipArray = [];

        if(ipSearch.indexOf(":") > -1) {
          ipArray = ipSearch.split(":");
        } else {
          ipArray = [ipSearch, 25565];
        }

        utils.ping(ipArray[0], ipArray[1], function(err, res) {
          if(err) {
            channel.sendMessage("MCServer> Socked timed out on " + cray[1]);
            return;
          }

          var embedded = new Discord.RichEmbed().setTitle(" **<Minecraft Server - `" + ipSearch + "`>**").setColor("#228B22");
          embedded.addField("Players", res.players.online + "/" + res.players.max);
          embedded.addField("Protocol Name", res.version.name);
          if(res.favicon) {
            embedded.setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + ipSearch);
          }

          channel.sendEmbed(embedded);
        }, 3000);
      }
      break;
    case '8ball':
      if(cray.length == 1) {
        channel.sendMessage(user + " Command> Please specify a term to search!\n EG: `#8ball is phineas a cat`")
      } else {
        ballCommand.hehe(cray.splice(1, cray.length).join(" "), function(res) {
          channel.sendMessage(user + " 8ball> " + res);
        });
      }
      break;
    case 'info':
      //TODO: Iterate this...
      var embedded = new Discord.RichEmbed().setTitle("**Paragon - Info**").setColor("#90B5CA");
      embedded.setDescription("**Paragon is a multi-platform bot built by [phineas.io](https://phineas.io)**");
      embedded.addField("Git Repo", "[GitHub](https://github.com/phineas/paragon-discord)", true);
      embedded.addField("Invite", "[Invitation Link](https://discordapp.com/api/oauth2/authorize?client_id=273591274899111937&scope=bot)", true).setURL("https://paragon.phineas.io").setThumbnail("https://paragon.phineas.io/img/paragon.png");
      channel.sendEmbed(embedded);
      break;
    case 'invite':
      //TODO: And this...
      var embedded = new Discord.RichEmbed().setDescription("**To invite, you must have management permissions - then just click the link below to select a server**").setColor("#90B5CA");
      embedded.addField("Invite", "[Invitation Link](https://discordapp.com/api/oauth2/authorize?client_id=273591274899111937&scope=bot)", true).addField("Creator", "[phineas.io](https://phineas.io)").setFooter("**In NUMBER_OF//TODO: guilds...**");
      channel.sendEmbed(embedded);
      break;
    default:
      channel.sendMessage("Paragon> ?! Command error...")
      break;
  }
}

module.exports = manager;
