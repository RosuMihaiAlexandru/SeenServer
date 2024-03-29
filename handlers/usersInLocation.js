const Boom = require('boom');
const User = require('../models/User');
const mongoose = require("mongoose");
const Logger = require("../helpers/Logger");
const UsersFilter = require("../helpers/UsersFilter");

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
    var locationRangeStopMeters = 100 //meters
    //meterConversion.mToKm(locationRangeStop) * 1000;
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
    try {
        await User.aggregate(
            [
                {
                    "$geoNear": {
                        "near": {
                            "type": "Point",
                            "coordinates": [longitude, latitude]
                        },
                        "distanceField": "dist",
                        "maxDistance": isFromSawSomeone ? 200 : locationRangeStopMeters, //meters
                        "spherical": true
                    }
                },
                { $limit: 10000},
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
                        arData: 1
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
            ],
            function (err, users) {
                if (err) {
                    Logger.logErrorAndWarning(loggedInUserId, err);
                }

                var hasNext = false;
                if (users && users.length > 100) {
                    users.pop();
                    hasNext = true;
                }

                var filteredUsers = [];
                if (users) {
                    for (var i = 0, len = users.length; i < len; i++) {
                        UsersFilter.filterUsersByLastAnsweredDate(filteredUsers, users[i], loggedInUserId);
                    }
                }
                if (!err) {
                    reply({ data: filteredUsers ? filteredUsers : [], hasNext: hasNext });
                }
            }
        );
    } catch (error) {
        Logger.logErrorAndWarning(loggedInUserId, error.message);
        reply({ data: [], hasNext: false });
    }

}

var meterConversion = (function () {
    var mToKm = function (distance) {
        return parseFloat(distance * 1.6);
    };
    var kmToM = function (distance) {
        return parseFloat(distance / 1.6);
    };

    return {
        mToKm: mToKm,
        kmToM: kmToM
    };
})();

