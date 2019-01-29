const Boom = require('boom');
const User = require('../models/User');
const mongoose = require("mongoose");
var moment = require('moment');

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId.toString();
    var longitude = parseFloat(request.params.long);
    var latitude = parseFloat(request.params.lat);
    var isShowMen = request.params.isShowMen === "true";
    var isShowWomen = request.params.isShowWomen === "true";

    var ageRangeStart = parseInt(request.params.ageRangeStart);
    var ageRangeStop = parseInt(request.params.ageRangeStop);
    var locationRangeStop = parseInt(request.params.locationRangeStop);
    var showGenderExpr = undefined;

    var dateRangeStart = new Date(moment().subtract(ageRangeStart, 'years').calendar());
    var dateRangeStop = new Date(moment().subtract(ageRangeStop, 'years').calendar());

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
                    "maxDistance": locationRangeStop,
                    "spherical": true
                }
            },
            {
                $match: {
                    $and: [{
                        birthDate: {
                            "$lte": dateRangeStart,
                            "$gte": dateRangeStop,
                        }
                    },
                        showGenderExpr,
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
