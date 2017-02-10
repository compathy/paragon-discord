const Discord = require("discord.js"),
  dbApi = require("../database.js"),
  dateFormat = require('dateformat'),
  async = require('async');

var manager = {};

manager.commands = ['help', 'info', 'invite', 'proxy', 'mcserver', 'hypixelstats', 'urbandictionary', '8ball', 'ipinfo', 'beta', 'twitter', 'guser', 'deploy-git-release', 'calculate', 'ping'];
manager.generalCommands = ['help', 'info', 'invite', 'proxy', 'ping', 'urbandictionary', '8ball', 'ipinfo', 'twitter', 'calculate'];
manager.minecraftCommands = ['mcserver', 'hypixelstats'];
manager.musicCommands = ['play', 'skip', 'queue', 'pause', 'resume'];
manager.managementCommands = ['beta', 'guser', 'deploy-git-release'];

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
const twitterCommand = require("./twitter");
const calcCommand = require("./wolfram");
const pingCommand = require("./ping");

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
      var mid = 0;
      if (cray.length == 1) {
        channel.sendMessage(user + " Command> Please specify a term to search!\n EG: `#urbandictionary phineas`")
      } else {
        channel.sendMessage(":gem: Computing...").then(messageTE => {
          let searchTerm = cray.slice(1, cray.length);
          let udSearchTerm = cray.slice(1, cray.length).join("+");

          urbandictionaryCommand.dict(udSearchTerm, function(err, res) {
            if (!err) {
              if (res) {
                var embedded = new Discord.RichEmbed().setTitle(" **<Urban Dictionary - `" + searchTerm.join(" ") + "`>**").setColor("#EFFF00");
                embedded.addField("Definition", res.definition).addField("Example", res.example).setURL(res.permalink);
                messageTE.edit("", {
                  embed: embedded
                });
              } else {
                messageTE.edit("Urban> No results for `\"" + searchTerm.join(" ") + "\"`");
              }
            } else {
              messageTE.edit("Manager> Unable to fetch information...");
            }
          });
        });
      }
      break;
    case 'mcserver':
      if (cray.length == 1) {
        channel.sendMessage(user + " Command> Please specify a term to search!\n EG: `#mcserver mc.hypixel.net`")
      } else {
        channel.sendMessage(":gem: Computing...").then(messageTE => {
          let ipSearch = cray[1];
          var ipArray = [];

          if (ipSearch.indexOf(":") > -1) {
            ipArray = ipSearch.split(":");
          } else {
            ipArray = [ipSearch, 25565];
          }

          utils.ping(ipArray[0], ipArray[1], function(err, res) {
            if (err) {
              messageTE.edit("MCServer> Socked timed out on " + cray[1]);
              return;
            }

            var embedded = new Discord.RichEmbed().setTitle(" **<Minecraft Server - `" + ipSearch + "`>**").setColor("#228B22");
            embedded.addField("Players", res.players.online + "/" + res.players.max);
            embedded.addField("Protocol Name", res.version.name);
            if (res.favicon) {
              embedded.setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + ipSearch);
            }

            messageTE.edit("", {
              embed: embedded
            });
          }, 3000);
        });
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
        embedded.addField("Invite", "[Invitation Link](https://discordapp.com/api/oauth2/authorize?client_id=273591274899111937&scope=bot)", true).addField("Creator", "[phineas.io](https://phineas.io)", true).setFooter("> In " + (res+28) + " guilds 🎇 phineas.io");
        channel.sendEmbed(embedded);
      });
      break;
    case 'ipinfo':
      if (cray.length == 1) {
        channel.sendMessage(user + " Command> Please specify a domain/IP to lookup!\n EG: `#ipinfo phineas.io`")
      } else {
        channel.sendMessage(":gem: Computing...").then(messageTE => {
          ipinfoCommand.getInfo(cray[1], function(err, res) {
            if (!err) {
              if (res.status == "success") {
                var embedded = new Discord.RichEmbed().setTitle("**<IP Info - `" + cray[1] + "`>**").setColor("#90B5CA");
                if (res.as && res.org && res.isp) {
                  embedded.addField("Organisation", res.org, true).addField("Region Name", res.regionName, true).addField("AS Number", res.as, true).addField("ISP", res.isp, false).addField("Query", res.query, true).setThumbnail("https://maps.googleapis.com/maps/api/staticmap?center=" + res.regionName + "&size=400x400");
                } else if (res.org) {
                  embedded.addField("Organisation", res.org, true).addField("Region Name", res.regionName, true).addField("ISP", res.isp, true).addField("Query", res.query, true).setThumbnail("https://maps.googleapis.com/maps/api/staticmap?center=" + res.regionName + "&size=400x400");
                } else {
                  embedded.addField("Organisation", "phineas.io cloud services", true).addField("Region Name", res.regionName, true).addField("ISP", "phin-cdn.stream", true).addField("Query", res.query, true).setThumbnail("https://maps.googleapis.com/maps/api/staticmap?center=" + res.regionName + "&size=400x400");
                }
                messageTE.edit("", {
                  embed: embedded
                });
              } else {
                messageTE.edit("IPInfo> Either that IP is out of range or the domain does not exist");
              }
            } else {
              messageTE.edit("IPInfo> Could not fetch data...");
            }
          });
        });
      }
      break;

    case 'hypixelstats':
      if (cray.length == 1) {
        channel.sendMessage(user + "Command> Please speciy a username to look up!")
      } else {
        channel.sendMessage(":gem: Computing...").then(messageTE => {
          var playerToSearch = cray[1];
          hypixelstatsCommand.getStats(playerToSearch, function(err, res) {
            if (!err) {
              if (res.success) {
                if (res.player) {
                  var jsonPlayer = res.player;
                  var jsonAchievements = jsonPlayer.achievements;
                  var embedded = new Discord.RichEmbed().setTitle("**<Hypixel Stats - `" + playerToSearch + "`>**").setColor("#228B22").setThumbnail("https://minotar.net/helm/" + playerToSearch);
                  //Get ready for horrible code...! (yes, it will be changed in future releases)
                  if (jsonPlayer.firstLogin) {
                    embedded.addField("First Join", dateFormat(jsonPlayer.firstLogin, "dddd, mmmm dS, yyyy, HH:mm:ss"), true);
                  }
                  if (jsonPlayer.lastLogin) embedded.addField("Last Login", dateFormat(jsonPlayer.lastLogin, "dddd, mmmm dS, yyyy, HH:mm:ss"), true);
                  if (jsonPlayer.newPackageRank) {
                    if (jsonPlayer.rank && jsonPlayer.rank != "NORMAL") {
                      embedded.addField("Rank", jsonPlayer.rank, true);
                    } else {
                      embedded.addField("Rank", jsonPlayer.newPackageRank, true);
                    }
                  }
                  if (jsonPlayer.networkLevel) {
                    embedded.addField("Network Level", jsonPlayer.networkLevel + 1);
                  }
                  if (jsonPlayer.achievementsOneTime) {
                    embedded.addField("Achievements", jsonPlayer.achievementsOneTime.length);
                  }
                  if (jsonPlayer.mcVersionRp) {
                    embedded.addField("MC Version", jsonPlayer.mcVersionRp);
                  }
                  if (jsonPlayer.socialMedia) {
                    var media = jsonPlayer.socialMedia;
                    if (media.TWITTER) embedded.addField("Twitter", media.TWITTER);
                    if (media.TWITCH) embedded.addField("Twitch", media.TWITCH);
                  }
                  messageTE.edit("", {embed: embedded});
                } else {
                  messageTE.edit(user + " Hypixel> That player does not exist in the Hypixel database!")
                }
              } else {
                messageTE.edit(user + " Hypixel> Looks like Hypixel's API is having a few issues...")
              }
            } else {
              messageTE.edit(user + " Hypixel> Could not fetch data...")
            }
          });
        });
      }
      break;
    case 'beta':
      //lol this rly needs to be optimised
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
    case 'twitter':
      if (cray.length == 1) {
        channel.sendMessage(user + " Command> Specify a Twitter username to lookup!");
      } else {
        var username = cray[1].replace(/@/g, '');
        twitterCommand.userInfo(username, function(err, res) {
          if (!err) {
            if (res.id) {
              var embedded = new Discord.RichEmbed().setTitle("**<Twitter - `" + res.name + "` >**").setColor(res.profile_link_color).setURL("https://twitter.com/" + username).setThumbnail(res.profile_image_url);
              if (res.verified || username === "itsphin") {
                embedded.addField("Verified", ":white_check_mark:")
              }
              embedded.addField("User ID", res.id_str, true).addField("Tweets", res.statuses_count).addField("Following >> Followers", res.friends_count + " >> " + res.followers_count)
              channel.sendEmbed(embedded);
            } else {
              channel.sendMessage(user + " Twitter> Couldn't fetch info.. are you sure that user is available?");
            }
          } else {
            channel.sendMessage(user + " Twitter> Couldn't fetch info.. are you sure that user is available?");
            console.error(err);
          }
        });
      }
      break;
/*    case 'invalidate-bearer-token':
      if (!user.id == "94490510688792576") {
        channel.sendMessage(user + " Permissions> This command is limited to root owners... Contact @Phineas#0247 for management help.")
      } else {
        twitterCommand.invalidateBearer(function(err, res) {
          if (res.access_token) {
            channel.sendMessage(user + " Management> Done :shield:");
          } else {
            channel.sendMessage(user + " Management> INVALID. COULD NOT REVOKE - DISCONNECTING DATABASE :satellite:");
          }
        });
      }
      break;*/
    case 'guser':
      if (user.id != "94490510688792576") {
        channel.sendMessage(user + " Permissions> This command is limited to root owners... Contact @Phineas#0247 for management help.");
      } else {
        if (cray.length == 1) {
          channel.sendMessage(user + " Command> Specify a user to gval...");
        } else {
          message.client.fetchUser(cray[1]).then(res => {
            channel.sendMessage(user + " gval> " + res.username + " --Descriminator: " + res.discriminator)
          }).catch(error => {
            channel.sendMessage(" gval> nullified_object :/")
          });
        }
      }
      break;
    case 'calculate':
      if(cray.length == 1) {
        channel.sendMessage(user + " Command> Enter a calculation... you can even ask things like \"what is the stock price of Twitter?\"")
      } else {
        channel.sendMessage(":gem: Computing...").then(messageTE => {
          let query = cray.slice(1, cray.length).join("+");
          calcCommand.getComputedWolfram(query, function(err, res) {
            if(!err) {
              if(res.length < 1024) {
                messageTE.edit("Calculate> " + res);
              } else {
                messageTE.edit("Calculate> Answer too long to display! :disappointed:");
              }
            } else {
              messageTE.edit("Calculate> Could not parse to Wolfram :/");
            }
          });
        });
      }
      break;
    case 'userinfo':
      if(cray.length == 1) {
        channel.sendMessage(user + " Command> Please enter a user to look up! You can either @mention them or specify a user ID")
      } else {
        channel.sendMessage(":gem: Computing...").then(messageTE => {
          /*if(message.mentions.users
          message.client.fetchUser()*/
          messageTE.edit("soontm");
        });
      }
      break;
    case 'ping':
      channel.sendMessage(":satellite: Pinging...").then(messageTE => {
        pingCommand.getPingRespMsg().then(statusMsg => {
          messageTE.edit("`Paragon Server Status (PINGED)` :satellite_orbital:\n" + statusMsg);
        });
      });
      break;
    default:
      channel.sendMessage("Paragon> ?! Command error...");
      break;
  }
}

module.exports = manager;

