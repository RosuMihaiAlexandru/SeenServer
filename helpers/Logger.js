const LogInfo = require("../models/LogInfo");

module.exports = {
    async logErrorAndWarning(loggedInUserId, errorMessage) {
        var status = {};
        await LogInfo.findOne({ memberId: loggedInUserId }, function (err, logInfo) {
            if (err) {
                status = { status: "failure", error: err };
            }

            if (logInfo) {
                logInfo.errorAndWarningsLog.push({
                    errorMessage: errorMessage,
                    errorTime: Date.now()
                })

                logInfo.save(function (err) {
                    if (err) {
                        status = { status: "failure", error: err };
                    }
                    else {
                        status = { status: "success" };
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
                LogInfo.create(newLogInfo);
                status = { status: "success" };
            }
        })
        return status;
    },

    async logDeleteReason(loggedInUserId, deleteReasonList) {
        var status = {};
        await LogInfo.findOne({ memberId: loggedInUserId }, function (err, logInfo) {
            if (err) {
                status = { status: "failure", error: err };
            }

            if (logInfo) {
                logInfo.deleteLog.push({
                    deleteReasonList: deleteReasonList,
                    deleteTime: Date.now()
                })

                logInfo.save(function (err) {
                    if (err) {
                        status = { status: "failure", error: err };
                    }
                    else {
                        status = { status: "success" };
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
                LogInfo.create(newLogInfo);
                status = { status: "success" };
            };
        })
        return status;
    },

    async logFeedback(loggedInUserId, feedbackLikeList, feedbackDislikeList) {
        var status = {};
        await LogInfo.findOne({ memberId: loggedInUserId }, function (err, logInfo) {
            if (err) {
                status = { status: "failure", error: err };
            }

            if (logInfo) {
                logInfo.feedbackLog.push({
                    feedbackLikeList: feedbackLikeList,
                    feedbackDislikeList: feedbackDislikeList,
                    feedbackTime: Date.now()
                })

                logInfo.save(function (err) {
                    if (err) {
                        status = { status: "failure", error: err };
                    }
                    else {
                        status = { "status": "success" };
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
                LogInfo.create(newLogInfo);
                status = { "status": "success" };
            };
        })
        return status;
    }
}