var command = {};

const responses = ["Sure, I guess so.", "Absolutely not.", "Nope, never.", "YES YES YES!", "Of course.", "Why not.", "No way.", "Are you joking? Of course not.", "NOT IN A MILLION YEARS.", "Not sure... ask again.", "Not looking hopeful tbh...", "Definitely.", "This has to be a joke..."];

command.hehe = function(question, callback) {
  var random = responses[Math.floor(Math.random()*responses.length)];

  callback(random);
}

module.exports = command;
