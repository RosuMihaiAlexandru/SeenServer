const User = require("../models/User");
const Logger = require("../helpers/Logger");

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
      user.userSubscriptionType = userSubscriptionType;

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
