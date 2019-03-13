
const User = require("../models/User");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var receipt = JSON.parse(request.payload.receipt);

    return User.findOne({ _id: loggedInUserId }, function (err, user) {
        if (err) {
            Logger.logErrorAndWarning(err);
            reply(err);
        }

        if (user) {
            user.isGoldMember = true;
            user.paymentInfo.receipts.push(receipt);
            user.save(function (err) {
                if (err) {
                    reply({ status: "fail" });
                } else {
                    reply({ status: "success" });
                }
            });
        }
    });
};
