const calculateScore = require('b5-calculate-score');
const getResult = require('@alheimsins/b5-result-text')
const User = require("../models/User");
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    try {
        const result = { answers: JSON.parse(request.payload.answers) };
        var loggedInUserId = request.payload.loggedInUserId;
        const scores = calculateScore(result);
        const dataArray = getResult({ scores, lang: 'en' });
        var succeeded = await saveBigFiveResult(loggedInUserId, JSON.stringify(dataArray), reply);
    } catch (error) {
        throw error
    }
}

async function saveBigFiveResult(loggedInUserId, dataArray, reply) {
    try {
        await User.findOne({ _id: loggedInUserId }, function (error, user) {
            if (error) {
                Logger.logErrorAndWarning(loggedInUserId, error);
            }
    
            if (user) {
                user.matchingData.bigFiveResult.lastDateAnswered = Date.now();
                user.matchingData.bigFiveResult.data = dataArray;
                user.markModified('matchingData');
                user.save(function (err) {
                    if (err) {
                        Logger.logErrorAndWarning(loggedInUserId, err);
                        reply(Boom.notFound("Error updating the User")).code(500);
                        return false;
                    }

                    reply({ data: user.matchingData.bigFiveResult, lastDateAnswered: user.matchingData.bigFiveResult.lastDateAnswered, status: "success" });
    
                });
            }
        });
        reply({ status: "failure" });
    
    } catch (error) {
        console.log(error);
    }
}