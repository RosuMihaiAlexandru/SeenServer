const Boom = require("boom");
const User = require("../models/User");
const mongoose = require("mongoose");
const Logger = require("../helpers/Logger");

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
        }
        
    ], function(err, users){
        if (err) {
            Logger.logErrorAndWarning(loggedInUserId, err);
        }
        
        if (users) {

            for(var i=0, len = users.length; i < len; i++){
                var msgs = [];
                var isFirstMember = users[i].Chat.members[0]._id == loggedInUserId;
                if(users[i].Chat.messages.length > 20){
                    users[i].Chat.messages.splice(0, users[i].Chat.messages.length - 20);                  
                }

                users[i].Chat.messages.forEach(function(message){
                    if(message.createdAt > (isFirstMember ? users[i].Chat.user1DeleteDate : users[i].Chat.user2DeleteDate)) {
                        msgs.push(message);
                    }
                });
                users[i].Chat.messages = msgs; 
            }
            reply(users);
        } else {
            reply([]);
        }
    });
};
