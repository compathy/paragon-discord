const Discord = require("discord.js"),
  dbApi = require("../database.js"),
  dateFormat = require('dateformat'),
  async = require('async');

var manager = {};

manager.commands = ['help', 'info', 'invite', 'proxy', 'mcserver', 'hypixelstats', 'urbandictionary', '8ball', 'ipinfo', 'beta'];
manager.generalCommands = ['help', 'info', 'invite', 'proxy', 'urbandictionary', '8ball', 'ipinfo'];
manager.minecraftCommands = ['mcserver', 'hypixelstats'];
manager.managementCommands = ['beta'];

manager.getHelp = function(callback) {
  var embedded = new Discord.RichEmbed().setTitle("-=-=-=-=-= Help =-=-=-=-=-").setColor("#90B5CA");

  embedded.addField("***-> General***", manager.generalCommands.join(", ")).addField("***-> Minecraft***", manager.minecraftCommands.join(", ")).addField("***-> Management***", manager.managementCommands.join(", "));

  callback(embedded);
}

//Commands:
const proxyCommand = require("./proxy");
const urbandictionaryCommand = require("./urbandictionary");
const utils = require("mc-utils");
const ballCommand = require("./8ball");
const ipinfoCommand = require("./ipinfo");
const hypixelstatsCommand = require("./hypixelstats");
const betaCommand = require("./beta");

manager.handleCommand = function(message, cray, user, channel) {
  let cmdToHandle = cray[0].replace(/>/g, '');

  switch (cmdToHandle) {
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
      if (cray.length == 1) {
        channel.sendMessage(user + " Command> Please specify a term to search!\n EG: `#urbandictionary phineas`")
      } else {
        let searchTerm = cray.slice(1, cray.length);
        let udSearchTerm = cray.slice(1, cray.length).join("+");

        urbandictionaryCommand.dict(udSearchTerm, function(err, res) {
          if (!err) {
            if (res) {
              var embedded = new Discord.RichEmbed().setTitle(" **<Urban Dictionary - `" + searchTerm.join(" ") + "`>**").setColor("#EFFF00");
              embedded.addField("Definition", res.definition).addField("Example", res.example).setURL(res.permalink);
              channel.sendEmbed(embedded);
            } else {
              channel.sendMessage("Urban> No results for `\"" + searchTerm.join(" ") + "\"`");
            }
          } else {
            channel.sendMessage("Manager> Unable to fetch information...");
          }
        });
      }
      break;
    case 'mcserver':
      if (cray.length == 1) {
        channel.sendMessage(user + " Command> Please specify a term to search!\n EG: `#mcserver mc.hypixel.net`")
      } else {
        let ipSearch = cray[1];
        var ipArray = [];

        if (ipSearch.indexOf(":") > -1) {
          ipArray = ipSearch.split(":");
        } else {
          ipArray = [ipSearch, 25565];
        }

        utils.ping(ipArray[0], ipArray[1], function(err, res) {
          if (err) {
            channel.sendMessage("MCServer> Socked timed out on " + cray[1]);
            return;
          }

          var embedded = new Discord.RichEmbed().setTitle(" **<Minecraft Server - `" + ipSearch + "`>**").setColor("#228B22");
          embedded.addField("Players", res.players.online + "/" + res.players.max);
          embedded.addField("Protocol Name", res.version.name);
          if (res.favicon) {
            embedded.setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + ipSearch);
          }

          channel.sendEmbed(embedded);
        }, 3000);
      }
      break;
    case '8ball':
      if (cray.length == 1) {
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
      dbApi.count({}, 'guilds', function(err, res) {
        var embedded = new Discord.RichEmbed().setDescription("**To invite, you must have management permissions - then just click the link below to select a server**").setColor("#90B5CA");
        embedded.addField("Invite", "[Invitation Link](https://discordapp.com/api/oauth2/authorize?client_id=273591274899111937&scope=bot)", true).addField("Creator", "[phineas.io](https://phineas.io)", true).setFooter("> In " + res + " guilds 🎇 phineas.io");
        channel.sendEmbed(embedded);
      });
      break;
    case 'ipinfo':
      if (cray.length == 1) {
        channel.sendMessage(user + " Command> Please specify a domain/IP to lookup!\n EG: `#ipinfo phineas.io`")
      } else {
        ipinfoCommand.getInfo(cray[1], function(err, res) {
          if (!err) {
            if (res.status == "success") {
              var embedded = new Discord.RichEmbed().setTitle("**<IP Info - `" + cray[1] + "`>**").setColor("#90B5CA");

              embedded.addField("Organisation", res.org, true).addField("Region Name", res.regionName, true).addField("AS Number", res.as, true);
              channel.sendEmbed(embedded);
            } else {
              channel.sendMessage("IPInfo> Either that IP is out of range or the domain does not exist");
            }
          } else {
            channel.sendMessage("IPInfo> Could not fetch data...");
          }
        });
      }
      break;
    case 'hypixelstats':
      if (cray.length == 1) {
        channel.sendMessage(user + "Command> Please speciy a username to look up!")
      } else {
        var playerToSearch = cray[1];
        hypixelstatsCommand.getStats(playerToSearch, function(err, res) {
          if (!err) {
            if (res.success) {
              if (res.player) {
                var jsonPlayer = res.player;
                var embedded = new Discord.RichEmbed().setTitle("**<Hypixel Stats - `" + playerToSearch + "`>**").setColor("#228B22").setThumbnail("https://minotar.net/helm/" + playerToSearch);
                if (jsonPlayer.firstLogin) {
                  var date = jsonPlayer.firstLogin;
                  embedded.addField("First Join", dateFormat(date, "dddd, mmmm dS, yyyy, HH:mm:ss"), true);
                }
                channel.sendEmbed(embedded);
              } else {
                channel.sendMessage(user + " Hypixel> That player does not exist in the Hypixel database!")
              }
            } else {
              channel.sendMessage(user + " Hypixel> Looks like Hypixel's API is having a few issues...")
            }
          } else {
            channel.sendMessage(user + " Hypixel> Could not fetch data...")
          }
        });
      }
      break;
    case 'beta':
      if (user.id != "94490510688792576") {
        channel.sendMessage(user + " Permissions> This command is limited to root owners... Contact @Phineas#0247 for management help.");
      } else {
        if (cray.length == 1) {
          channel.sendMessage(user + " Command> Enter a beta action... (addTester, removeTester, getTesters)");
        } else {
          var action = cray[1];
          if (["addTester", "removeTester", "getTesters"].indexOf(action) > -1) {
            if (action == "addTester") {
              if (cray.length > 2) {
                var userToUpdate = message.client.fetchUser(cray[2]);

                betaCommand.addTester(cray[2], function(err, res) {
                  if (res.success) {
                    if (!res.alreadyTester) {
                      var guild = message.client.guilds.get("273589608456126464");
                      if (guild.available) {
                        if (guild.fetchMember(userToUpdate)) {
                          message.client.channels.get("273589608456126464").sendMessage("Woop! " + userToUpdate + " is now a beta tester! :control_knobs:");
                        } else {
                          message.client.channels.get("273589608456126464").sendMessage("Yay! " + userToUpdate.getUsername + " was added to the beta testers group! :control_knobs:");
                        }
                      }
                      if (res.new) {
                        channel.sendMessage(user + " Management> Woop! Added " + userToUpdate.username + " to beta testers! :control_knobs:");
                        userToUpdate.sendMessage("Management> Welcome to the beta tester group! You now have access to secret stuff, you'll figure it out ;) :control_knobs:").catch(console.err);
                      } else {
                        channel.sendMessage(user + " Management> Yay! " + userToUpdate.username + " was added back to beta testers! :control_knobs:");
                        userToUpdate.sendMessage("Management> Welcome back to the beta tester group! :control_knobs:").catch(console.err);
                      }
                    } else {
                      channel.sendMessage(user + " Management> Whoops, that user is already a beta tester! :joy_cat:");
                    }
                  } else {
                    channel.sendMessage(user + " Management> Failed to update user :disappointed:")
                  }
                });
              } else {
                channel.sendMessage(user + " Management> You need to specify a user ID to add");
              }
            } else if (action == "removeTester") {} else if (action == "getTesters") {
              betaCommand.getTesters(function(err, res) {
                if (!err) {
                  //I've tried multiple async & loop ways to make this work -- it doesn't, it'd be great if somebody could PR :)
                  var testers = [];
                  for (i in res) {
                    channel.sendMessage(user + " `Beta Testers -> " + testers.join(", "));
                    var id = res[i].userID;
                    var uid = message.client.fetchUser(id).then(function(result) {
                      testers.push(result.username)
                    });
                    if (testers.length <= res.length) {
                      channel.sendMessage(user + " `Beta Testers -> " + testers.join(", "));
                    }
                  }
                } else {
                  console.log(err);
                }
              });
            } else {
              channel.sendMessage(user + " Command> Beta action does not exist... (addTester, removeTester, getTesters)");
            }
          }
        }
      }
      break;
    default:
      channel.sendMessage("Paragon> ?! Command error...")
      break;
  }
}

module.exports = manager;
