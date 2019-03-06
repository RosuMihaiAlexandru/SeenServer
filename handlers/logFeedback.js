
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var loggedInUserId = request.params.loggedInUserId;
    var likeList = request.payload.likeList === null || request.payload.likeList === undefined ? [] : JSON.parse(request.payload.likeList);
    var dislikeList = request.payload.dislikeList === null || request.payload.dislikeList === undefined ? [] : JSON.parse(request.payload.dislikeList);

    reply(Logger.logFeedback(loggedInUserId, likeList, dislikeList));
};
