const Boom = require("boom");
const User = require("../models/User");

const fs = require('fs');

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var base64PhotoString = request.payload.base64PhotoString;
    var type = request.payload.type;

    await User.findOne({ _id: loggedInUserId }).then(user => {
        if (user) {
            try {
                var imageBuffer = decodeBase64Image(base64PhotoString);
                var objToReturn = {};
                var userDirectory = "../../../mnt/seenblockstorage/" + user.email;
                if (!fs.existsSync(userDirectory)) {
                    fs.mkdirSync(userDirectory);
                }


                if (type === "profile") {
                    fs.writeFileSync(userDirectory + "/profile.jpg", imageBuffer.data);

                    user.profileImage.media = 'http://167.99.200.101/seenblockstorage/' + user.email + "/profile.jpg";
                    objToReturn = user.profileImage;
                }

                else if (type === "normal") {

                    fs.writeFileSync(userDirectory + '/' + user.userImages.length.toString() + ".jpg", imageBuffer.data);
                    user.userImages.push({
                        'contentType': "image/jpg",
                        'media': 'http://167.99.200.101/seenblockstorage/' + user.email + '/' + user.userImages.length.toString() + ".jpg"
                    });
                    objToReturn = user.userImages;
                }

                else if (type === "cover") {
                    fs.writeFileSync(userDirectory + "/cover.jpg", imageBuffer.data);
                    user.coverImage.media = 'http://167.99.200.101/seenblockstorage/' + user.email + "/cover.jpg";
                    objToReturn = user.coverImage;
                }

            } catch (error) {
                reply({ error: error });
                return;
            }

            user.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the User")).code(500);
                }
            });

            reply({ objToReturn: objToReturn });
        }
    });
};


function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}
