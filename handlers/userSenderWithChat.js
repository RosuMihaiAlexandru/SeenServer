const Boom = require("boom");
const User = require("../models/User");
const mongoose = require("mongoose");

module.exports = async function (request, reply) {
    var userSenderId = request.params.userSenderId.toString();
    var userReceiverId = request.params.userReceiverId.toString();
    await User.aggregate([
        {
            $match: {
                _id: {
                    $ne: mongoose.Types.ObjectId(userReceiverId),
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
                            $in: [
                                mongoose.Types.ObjectId(userReceiverId),
                                "$Chat.members"
                            ]
                         },
                       {
                        $in: [
                            mongoose.Types.ObjectId(userSenderId),
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
            reply(users[0]);
        } else {
        }
    });
};
