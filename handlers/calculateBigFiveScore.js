const calculateScore = require('b5-calculate-score');
const getResult = require('@alheimsins/b5-result-text')

module.exports = async function (request, reply) {
    try {
        const result = { answers: JSON.parse(request.payload.answers) };
        var loggedInUserId = request.payload.loggedInUserId;
        const scores = calculateScore(result);
        const bigFiveResult = getResult({ scores, lang: 'en' });
        saveBigFiveResult(loggedInUserId, bigFiveResult);
        reply({ data: getResult({ scores, lang: 'en' }), status: "success" });
    } catch (error) {
        throw error
    }
}

function saveBigFiveResult(loggedInUserId, data) {
    User.findOne({ _id: loggedInUserId }, function (error, user) {
        if (error) {
            Logger.logErrorAndWarning(loggedInUserId, error);
        }

        if (user) {
            user.matchingData.bigFiveResult = data;

            user.save(function (err) {
                if (err) {
                    Logger.logErrorAndWarning(loggedInUserId, err);
                    reply(Boom.notFound("Error updating the User")).code(500);
                    return false;
                }

                else return true;
            });
        }
    });
}