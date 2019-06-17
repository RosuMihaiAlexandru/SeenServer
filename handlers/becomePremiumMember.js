const User = require("../models/User");
const Logger = require("../helpers/Logger");
const userSubscriptionTypes = require("../constants/userSubscriptionTypes");

module.exports = async function(request, reply) {
  var loggedInUserId = request.payload.loggedInUserId;
  var userSubscriptionType = request.payload.userSubscriptionType;
  var receipt = JSON.parse(request.payload.receipt);

  return User.findOne({ _id: loggedInUserId }, function(err, user) {
    if (err) {
      Logger.logErrorAndWarning(loggedInUserId, err);
      reply(err);
    }

    if (user) {
      if (userSubscriptionType === userSubscriptionTypes.gold) {
        user.userSubscriptionType = userSubscriptionType.gold;
      } else if (userSubscriptionType === userSubscriptionTypes.platinum) {
        user.userSubscriptionType = userSubscriptionType.platinum;
      }

      user.paymentInfo.receipts.push(receipt);
      user.save(function(err) {
        if (err) {
          Logger.logErrorAndWarning(loggedInUserId, err);
          reply({ status: "failure" });
        } else {
          reply({ status: "success" });
        }
      });
    }
  });
};
