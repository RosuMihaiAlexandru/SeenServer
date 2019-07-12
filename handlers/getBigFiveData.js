const BigFive = require("../models/BigFive");
const Logger = require("../helpers/Logger");
const BigFiveData = require("../bigFive/bigFiveData");

module.exports = async function(request, reply) {
  try {
    // BigFive.insertMany(BigFiveData, function (err, bigFive) {
    //   if (err) {
    //     console.log(err);
    //   };
    //   console.log(bigFive);
    // });
    

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
