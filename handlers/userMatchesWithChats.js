const Boom = require("boom");
const User = require("../models/User");
const mongoose = require("mongoose");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId.toString();

    await User.aggregate([
        {

            $lookup: {
                from: "MembersChat",
                localField: "_id",
                foreignField: "members",
                as: "Chats"
            }
        },
        {
            $unwind: "$Chats"
          },
        {
            $match: {
                _id: {
                    $ne: mongoose.Types.ObjectId(loggedInUserId),
                },
                  "$expr": { "$in": [mongoose.Types.ObjectId(loggedInUserId), "$Chats.members"] } 
            }
        }
    ]).then(users => {
        if (users) {
            reply(users);
        } else {
        }
    });
};
