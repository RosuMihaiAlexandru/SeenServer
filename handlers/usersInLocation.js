const Boom = require('boom');
const User = require('../models/User');
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
    var isFromSawSomeone = request.query.isFromSawSomeone === "1";
    var showGenderExpr = undefined;
    var locationRangeStopKm = meterConversion.mToKm(locationRangeStop);

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

    await User.aggregate(
        [
            {
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [longitude, latitude]
                    },
                    "distanceField": "dist",
                    "maxDistance": isFromSawSomeone ? 200 : locationRangeStopKm,
                    "spherical": true
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
        ],
        function (err, users) {
            if (err) {
                Logger.logErrorAndWarning(loggedInUserId, err);
            }
            
            for (var i = 0, len = users.length; i < len; i++) {
                if (users[i].Chat.length > 0) {
                    if (users[i].Chat[0].messages.length > 20) {
                        users[i].Chat[0].messages.splice(0, users[i].Chat[0].messages.length - 21);
                    }
                }
            }
            reply(users);
        }
    );
}

var meterConversion = (function() {
    var mToKm = function(distance) {
        return parseFloat(distance * 1.6);
    };
    var kmToM = function(distance) {
        return parseFloat(distance / 1.6);
    };
    
    return {
        mToKm : mToKm,
        kmToM : kmToM
    };
})();

