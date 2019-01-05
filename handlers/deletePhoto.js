const Boom = require("boom");
const User = require("../models/User");

const fs = require('fs');

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var photoIndex = parseInt(request.payload.photoIndex);

    await User.findOne({ _id: loggedInUserId }).then(user => {
        if (user) {

            var filePath = '';

            var imageToBeDeleted = user.userImages[photoIndex].media;

            var match = imageToBeDeleted.substring(21, imageToBeDeleted.length);
            if (match.length > 1) {
                filePath = "../../../mnt" + match;       
                }
            else {
                // Not found
            }

            user.userImages.splice(photoIndex, 1);

            user.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the User")).code(500);
                }
            });
        

            fs.access(filePath, error => {
                if (!error) {
                    fs.unlink(filePath, function (error) {
                        if (error) {
                            reply({ error: error });
                        }

                    });
                } else {
                    reply({ error: error });
                }
            });

        }
    });
};
