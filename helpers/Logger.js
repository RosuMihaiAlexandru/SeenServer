const LogInfo = require("../models/LogInfo");

module.exports = {
    async logErrorAndWarning(loggedInUserId, errorMessage) {
        return LogInfo.findOne({ memberId: loggedInUserId }, function (err, logInfo) {
            if (err) {
                reply(err);
            }

            if (logInfo) {
                logInfo.errorAndWarningsLog.push({
                    errorMessage: errorMessage,
                    errorTime: Date.now()
                })

                logInfo.save(function (err) {
                    if (err) {
                        reply(Boom.notFound("Error updating the LogInfo"));
                    }
                    else {
                        reply({ "status": "Success" });
                    }
                });

            } else {
                var newLogInfo = {
                    memberId: loggedInUserId,
                    feedbackLog: [],
                    deleteLog: [],
                    errorAndWarningsLog: [{
                        errorMessage: errorMessage,
                        errorTime: Date.now()
                    }]
                }
            };
            LogInfo.create(newLogInfo);
        })
    },

    async logDeleteReason(loggedInUserId, deleteReasonList) {
        return LogInfo.findOne({ memberId: loggedInUserId }, function (err, logInfo) {
            if (err) {
                reply(err);
            }

            if (logInfo) {
                logInfo.deleteLog.push({
                    deleteReasonList: deleteReasonList,
                    deleteTime: Date.now()
                })

                logInfo.save(function (err) {
                    if (err) {
                        reply(Boom.notFound("Error updating the LogInfo"));
                    }
                    else {
                        reply({ "status": "Success" });
                    }
                });

            } else {
                var newLogInfo = {
                    memberId: loggedInUserId,
                    feedbackLog: [],
                    errorAndWarningsLog: [],
                    deleteLog: [{
                        deleteReasonList: deleteReasonList,
                        deleteTime: Date.now()
                    }]
                }
            };
            LogInfo.create(newLogInfo);
        })
    },

    async logFeedback(loggedInUserId, feedbackLikeList, feedbackDislikeList) {
        return LogInfo.findOne({ memberId: loggedInUserId }, function (err, logInfo) {
            if (err) {
                reply(err);
            }

            if (logInfo) {
                logInfo.feedbackLog.push({
                    feedbackLikeList: feedbackLikeList,
                    feedbackDislikeList: feedbackDislikeList,
                    feedbackTime: Date.now()
                })

                logInfo.save(function (err) {
                    if (err) {
                        reply(Boom.notFound("Error updating the LogInfo"));
                    }
                    else {
                        reply({ "status": "Success" });
                    }
                });

            } else {
                var newLogInfo = {
                    memberId: loggedInUserId,
                    feedbackLog: [{
                        feedbackLikeList: feedbackLikeList,
                        feedbackDislikeList: feedbackDislikeList,
                        feedbackTime: Date.now()
                    }],
                    errorAndWarningsLog: [],
                    deleteLog: []
                }
            };
            LogInfo.create(newLogInfo);
        })
    }
}