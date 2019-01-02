const Boom = require("boom");
const User = require("../models/User");

const fs = require('fs');

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var photoIndex = parseInt(request.payload.photoIndex);

    await User.findOne({ _id: loggedInUserId}).then(user => {
        if (user) {

            const filePath = user.userImages[photoIndex].media;
            fs.access(filePath, error => {
                if (!error) {
                    fs.unlink(filePath,function(error){
                        console.log(error);
                    });
                } else {
                    console.log(error);
                }
            });

            // user.userImages.splice(photoIndex, 1);

            // user.save(function (err) {
            //     if (err) {
            //         reply(Boom.notFound("Error updating the User")).code(500);
            //     }
            // });

            reply({
                deleted: 'successfull'
            }).code(200);
        }
    });
};
