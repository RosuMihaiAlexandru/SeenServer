const User = require('../models/User');
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    console.log(request.payload.location);
    const userId = request.payload.userId;
    const coords = request.payload.location.coords;

    await User.findOne({ _id: userId }, function (err, user) {
        if (err) {
            Logger.logErrorAndWarning(userId, err);
            reply({status: 'failure'});
        }

        if (user) {
            user.location.coordinates = [coords.latitude, coords.longitude];
            user.save(function(err) {
                if (err) {
                    Logger.logErrorAndWarning(userId, err);
                    reply({status: 'failure'});
                }
                else {
                    reply({status: 'success'});
                }
            });           
        }
    });
}