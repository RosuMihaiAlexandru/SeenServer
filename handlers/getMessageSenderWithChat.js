const Boom = require("boom");
const User = require("../models/User");
const mongoose = require("mongoose");
const Logger = require("../helpers/Logger");

module.exports = async function (userSenderId, userReceiverId, reply) {
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
        if(err) {
            Logger.logErrorAndWarning(userSenderId, err);
        }

        if (users) {
            var msgs = [];
            var isFirstMember = users[0].Chat.members[0]._id == userReceiverId;
            if(users[0].Chat.messages.length > 20){
                users[0].Chat.messages.splice(0, users[0].Chat.messages.length - 20);             
            }

            users[0].Chat.messages.forEach(function(message){
                if(message.createdAt > (isFirstMember ? users[0].Chat.user1DeleteDate : users[0].Chat.user2DeleteDate)) {
                    msgs.push(message);
                }
            });
            users[0].Chat.messages = msgs; 
            reply(users[0]);
        } else {
        }
    });
};
