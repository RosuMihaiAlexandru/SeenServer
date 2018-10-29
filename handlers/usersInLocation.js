const Boom = require('boom');
const User = require('../models/User');
const mongoose = require("mongoose");

module.exports = async function (request, reply) {

    var currentUserId = request.params.currentUserId.toString();
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
                        $ne: mongoose.Types.ObjectId(currentUserId),
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
                        { "$match": { "$expr": { "$in": [mongoose.Types.ObjectId(currentUserId), "$members"] } } }
                    ],
                    as: "Likes"
                }
            }
        ],
        function (err, results) {
            reply(results);
        }
    );
}