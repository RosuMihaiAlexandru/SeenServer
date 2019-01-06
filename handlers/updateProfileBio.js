const Boom = require("boom");
const User = require("../models/User");


module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var userName = request.payload.userName;
    var occupation = request.payload.occupation;
    var enjoys = request.payload.enjoys;
    var weakness = request.payload.weakness;
    var religion = request.payload.religion;
    var birthDate = request.payload.birthDate;
    var education = request.payload.education;
    var about = request.payload.about;
    var height = request.payload.height;
    var city = request.payload.city;

    await User.findOne({ _id: loggedInUserId}).then(user => {
        if (user) {        
            user.userName = userName;
            user.occupation = occupation;
            user.enjoys = enjoys;
            user.weakness = weakness;
            user.religion = religion;
            user.birthDate = birthDate;
            user.education = education;
            user.about = about;
            user.height = height;
            user.city = city;

            user.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the User")).code(500);
                    return;
                }
            });

            reply({
                profileBioUpdated: 'ok'
            }).code(200);
        }
    });
};
