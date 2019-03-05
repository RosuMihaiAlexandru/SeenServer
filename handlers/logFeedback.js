
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId;
    var likeList = JSON.parse(request.payload.likeList);
    var dislikeList = JSON.parse(request.payload.dislikeList);

    return Logger.logFeedback(loggedInUserId, likeList, dislikeList);
};
