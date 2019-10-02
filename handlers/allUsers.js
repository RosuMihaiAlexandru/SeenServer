const Boom = require("boom");
const User = require("../models/User");
const mongoose = require("mongoose");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = request.query.loggedInUserId.toString();
    var longitude = parseFloat(request.query.long);
    var latitude = parseFloat(request.query.lat);
    var isShowMen = request.query.isShowMen === "1";
    var isShowWomen = request.query.isShowWomen === "1";

    var ageRangeStart = parseInt(request.query.ageRangeStart);
    var ageRangeStop = parseInt(request.query.ageRangeStop);
    var locationRangeStop = parseInt(request.query.locationRangeStop);
    var showGenderExpr = undefined;
    var page = parseInt(request.query.page);

    if (isShowMen && isShowWomen) {
        showGenderExpr = {
            $or: [{
                gender: { "$eq": "male" }
            },
            {
                gender: { "$eq": "female" }
            }]
        }
    }

    if (isShowMen && !isShowWomen) {
        showGenderExpr = {
            gender: { "$eq": "male" }
        }
    }

    if (!isShowMen && isShowWomen) {
        showGenderExpr = {
            gender: { "$eq": "female" }
        }
    }

    await User.aggregate([
        {
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [latitude, longitude]
                },
                "distanceField": "dist",
                "maxDistance": 120000,
                "spherical": true,
                "limit": 10000
            }
        },

        {
            $project: {
                date: "$birthDate",
                age: {
                    $floor: {
                        $divide: [{ $subtract: [new Date(), "$birthDate"] },
                        (365 * 24 * 60 * 60 * 1000)]
                    }
                },
                _id: 1,
                userName: 1,
                userPassword: 1,
                accountIsHidden: 1,
                matchingData: 1,
                gender: 1,
                email: 1,
                birthDate: 1,
                city: 1,
                height: 1,
                ethnicity: 1,
                religion: 1,
                occupation: 1,
                education: 1,
                about: 1,
                weakness: 1,
                enjoys: 1,
                location: 1,
                favouriteLocation: 1,
                userImages: 1,
                profileImage: 1,
                coverImage: 1,
                arData: 1,
                __v: 1,
                playerIds: 1,
                unreadConversations: 1,
                dist: 1,
            }
        },
        {
            $match: {
                $and: [{
                    age: {
                        "$lte": ageRangeStop,
                        "$gte": ageRangeStart,
                    }
                },
                    showGenderExpr,
                {
                    accountIsHidden: {
                        $eq: false,
                    }
                },
                {
                    _id: {
                        $ne: mongoose.Types.ObjectId(loggedInUserId),
                    }
                }]
            }
        },
        { $limit: page * 100 + 2 },
        { $skip: page * 100 - 100 },
        {
            $lookup: {
                from: "MembersChat",
                let: { id: "$_id" },
                pipeline: [
                    {
                        "$match": { "$expr": { "$in": ["$$id", "$members"] } }
                    },
                    { "$match": { "$expr": { "$in": [mongoose.Types.ObjectId(loggedInUserId), "$members"] } } }
                ],
                as: "Chat"
            }
        }
    ], function (error, users) {
        if(error) {
            Logger.logErrorAndWarning(loggedInUserId, error);
            reply([]);
        }

        var hasNext = false;
        if (users && users.length > 100) {
          users.pop();
          hasNext = true;
        }

        if (users) {
            for (var i = 0, len = users.length; i < len; i++) {
                if (users[i].Chat.length > 0) {
                    if (users[i].Chat[0].messages.length > 20) {
                        users[i].Chat[0].messages.splice(0, users[i].Chat[0].messages.length - 20);
                    }
                }
            }
            reply({ data: users, hasNext: hasNext });

        } else {
            reply({data: [], hasNext: hasNext});
        }
    });
};
