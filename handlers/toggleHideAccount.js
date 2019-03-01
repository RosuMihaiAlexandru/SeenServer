const Boom = require("boom");
const User = require("../models/User");


module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var hideAccount = request.payload.hideAccount;

    await User.findOne({ _id: loggedInUserId }).then(user => {
        if (user) {
            user.accountIsHidden = hideAccount;
            user.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the User")).code(500);
                }
            });

            reply({
                status: "success"
            }).code(200);
        }
    });
};
