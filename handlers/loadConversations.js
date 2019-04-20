const Boom = require("boom");
const MembersChat = require("../models/MembersChat");
const mongoose = require("mongoose");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId.toString();

    await MembersChat.aggregate([
        {
            $match: {
                "$expr":
                { "$in": [
                    mongoose.Types.ObjectId(loggedInUserId) , "$members"
                ]
                }
            }
        },
        {
            $match: {
                user1Liked: { $eq: true },
                user2Liked: { $eq: true }
            }
        },
        {
            $lookup: {
                from: "User",
                localField: "members",
                foreignField: "_id",
                as: "MyMatch"
              }
         },
        {
            "$addFields": {
                "MyMatch": {
                    "$arrayElemAt": [
                        {
                            "$filter": {
                                "input": "$MyMatch",
                                "as": "match",
                                "cond": {
                                    "$ne": [ "$$match._id", mongoose.Types.ObjectId(loggedInUserId) ]
                                }
                            }
                        }, 0
                    ]
                }
            }
        }
    ],
    function(error, membersChat) {
        if (error) {
            Logger.logErrorAndWarning(loggedInUserId, error);
        }

        if (membersChat) {
            reply(membersChat);
        } else {
        }
    });
};
