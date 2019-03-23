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
                                false
                            ]
                        },
                        {
                            $let: {
                                vars: { second: { $arrayElemAt: ["$Chat.members", 1] } },
                                in: { $eq: ["$$second", mongoose.Types.ObjectId(loggedInUserId)] }
                            }

                        }
                    ]
                }
            }
        }

    ], function (err, users) {

        console.log(err);
    }).then(users => {

        if (users) {
            for (var i = 0, len = users.length; i < len; i++) {
                if (users[i].Chat.messages.length > 20) {
                    users[i].Chat.messages.splice(0, users[i].Chat.messages.length - 20);
                }
            }
            reply(users);
        } else {
        }
    });
};
