const Boom = require("boom");
const User = require("../models/User");
const mongoose = require("mongoose");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId.toString();

    await User.aggregate([
        {
            $match: {
                _id: {
                    $ne: mongoose.Types.ObjectId(loggedInUserId),
                }
            }
        },
        {

            $lookup: {
                from: "MembersChat",
                localField: "_id",
                foreignField: "members",
                as: "Chat"
            }
        
        },
        {
            $unwind: "$Chat"
          },
        {
            $match: {
                $expr: {
                    $and: [
                       {
                          $eq: [
                             "$Chat.user1Liked",
                             true
                          ]
                       },
                       {
                          $eq: [
                             "$Chat.user2Liked",
                             true
                          ]
                       },
                       {
                        $in: [
                            mongoose.Types.ObjectId(loggedInUserId),
                            "$Chat.members"
                        ]
                     }
                    ]
                 }
            }
        },
        
    ], function(err, users){

        console.log(err);
    }).then(users => {
        if (users) {
            reply(users);
        } else {
        }
    });
};
