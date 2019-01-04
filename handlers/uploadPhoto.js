const Boom = require("boom");
const User = require("../models/User");


module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var base64PhotoString = request.payload.base64PhotoString;
    var type = request.payload.type;

    await User.findOne({ _id: loggedInUserId}).then(user => {
        if (user) {
            var bitmap = new Buffer(base64PhotoString, 'base64');
            var objToReturn = {};
            var userDirectory = "../../../mnt/seenblockStorage/" + user.email;
            if (!fs.existsSync(userDirectory)){
                fs.mkdirSync(userDirectory);
            }

            if(type === "profile"){
                fs.writeFileSync(userDirectory + "/profile.jpg", bitmap);

                user.profileImage.media = 'http://167.99.200.101/seenblockstorage/' + user.email + "/profile.jpg";       
                objToReturn = user.profileImage;    
            }

            else if(type === "normal"){

                fs.writeFileSync(userDirectory +  '/' + user.userImages.length.toString() + ".jpg", bitmap);
                user.userImages.push({'contentType' : "image/jpg",  
                                        'media' : 'http://167.99.200.101/seenblockstorage/' + user.email +  '/' + user.userImages.length.toString() + ".jpg" });  
                objToReturn = user.userImages;   
            }

            else if(type === "cover"){
                fs.writeFileSync(userDirectory + "/cover.jpg", bitmap);
                user.coverImage.media = 'http://167.99.200.101/seenblockstorage/' + user.email + "/cover.jpg" ;
                objToReturn = user.coverImage;     
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
