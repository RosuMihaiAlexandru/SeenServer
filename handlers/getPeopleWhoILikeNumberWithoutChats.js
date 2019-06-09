const Boom = require("boom");
const User = require("../models/User");
const mongoose = require("mongoose");
const Logger = require("../helpers/Logger");

module.exports = async function(request, reply) {
  var loggedInUserId = request.payload.member1.toString();

  return new Promise(function(resolve, reject) {
    User.aggregate(
      [
        {
          $match: {
            _id: {
              $eq: mongoose.Types.ObjectId(loggedInUserId)
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
                  $eq: ["$Chat.user1Liked", true]
                },
                {
                  $eq: ["$Chat.user2Liked", false]
                },
                {
                  $let: {
                    vars: { second: { $arrayElemAt: ["$Chat.members", 1] } },
                    in: {
                      $eq: ["$$second", mongoose.Types.ObjectId(loggedInUserId)]
                    }
                  }
                }
              ]
            }
          }
        }
      ],
      function(err, users) {
        if (err) {
          Logger.logErrorAndWarning(loggedInUserId, err);
          reject(err);
        }

        if (users) {
          resolve(users.length);
        } else {
          resolve(0);
        }
      }
    );
  });
};
