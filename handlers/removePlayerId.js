const User = require("../models/User");

module.exports = async function (request, reply) {
    var userId = request.payload.userId;
    var devicePlayerId = request.payload.devicePlayerId;

    await User.findOne({ _id: userId}).then(user => {
        if (user && user.playerIds.includes(devicePlayerId)) {
            user.playerIds.splice(user.playerIds.indexOf(devicePlayerId), 1);
            user.save(function (err) {
                if (err) {
                    reply({
                        status: 'failed',
                        reason: 'Error updating the user'
                    }).code(500);
                }
                else{
                    reply({
                        status: 'success'
                    }).code(200)
                }
            });
        }
        else{
            reply({
                status: 'failed',
                reason: 'User not found or user does not contain specified player id'
            }).code(404)
        }
    });
};