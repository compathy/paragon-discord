var manager = {};

manager.commands = ['help', 'proxy', 'mcserver', 'hypixelstats', 'urbandictionary'];
manager.generalCommands = ['help', 'proxy', 'urbandictionary'];
manager.minecraftCommands = ['mcserver', 'hypixelstats'];

manager.getHelp = function(callback) {
  var helpObj = [];

  helpObj.push("-=-=-=-=-= Help =-=-=-=-=-");
  helpObj.push("\n-> General Help\n" + manager.generalCommands.join(", "));
  helpObj.push("\n\n-> Minecraft Help\n" + manager.minecraftCommands.join(", "));

  callback(helpObj.join(""));
}

module.exports = manager;
