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

    async logDeleteReason(loggedInUserId, logDeleteReason) {
        return LogInfo.findOne({ memberId: loggedInUserId }, function (err, logInfo) {
            if (err) {
                reply(err);
            }

            if (logInfo) {
                logInfo.deleteLog.push({
                    deleteReasonList: logDeleteReason,
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
                        deleteReasonList: logDeleteReason,
                        deleteTime: Date.now()
                    }]
                }
            };
            LogInfo.create(newLogInfo);
        })
    }
}