const User = require("../models/User");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
  var loggedInUserId = request.payload.loggedInUserId;
  var receipt = request.payload.receipt ? JSON.parse(request.payload.receipt) : null;

  return User.findOne({ _id: loggedInUserId }, function (err, user) {
    if (err) {
      Logger.logErrorAndWarning(loggedInUserId, err);
      reply(err);
    }

    if (user) {
      user.arData.arGiftsLeft = 15;
      if (receipt) {
        user.arData.purchases.push(receipt);
      }
      user.save(function (err) {
        if (err) {
          Logger.logErrorAndWarning(loggedInUserId, err);
          reply({ status: "failure" });
        } else {
          reply({ status: "success", data: user.arData.arGiftsLeft });
        }
      });
    }
  });
};
