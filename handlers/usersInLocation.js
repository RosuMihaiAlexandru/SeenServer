const Boom = require('boom');
const User = require('../models/User');
const mongoose = require("mongoose");

module.exports = async function (request, reply) {

    var loggedInUserId = request.params.loggedInUserId.toString();
    var longitude = parseFloat(request.params.long);
    var latitude = parseFloat(request.params.lat);
    await User.aggregate(
        [
            {
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [longitude, latitude]
                    },
                    "distanceField": "dist",
                    "maxDistance": 20,
                    "spherical": true
                }
            },
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
            for(var i=0, len = users.length; i < len; i++){
                if(users[i].Chat.length > 0){
                    if(users[i].Chat[0].messages.length > 20){
                       users[i].Chat[0].messages.splice(0, users[i].Chat[0].messages.length - 21); 
                    }
                }
            }
            reply(users);
        }
    );
}