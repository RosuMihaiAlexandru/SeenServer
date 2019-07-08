const BigFive = require("../models/BigFive");
const Logger = require("../helpers/Logger");

module.exports = async function(request, reply) {
  try {
    BigFive.find(function(error, bigFiveData) {
      if (error) {
        Logger.logErrorAndWarning(loggedInUserId, err);
        reply(err);
      }
      if (bigFiveData) {
        reply(bigFiveData);
      }
    });
  } catch (error) {
    reply(error);
  }
};
