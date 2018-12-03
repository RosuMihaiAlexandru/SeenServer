const Boom = require("boom");
const User = require("../models/User");
const mongoose = require("mongoose");

module.exports = async function (userSenderId, userReceiverId) {


    return User.aggregate([
        {
            $match: {
                _id: {
                    $ne: mongoose.Types.ObjectId(userSenderId),
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
            return users[0];
        } else {
        }
    });
};
