const calculateScore = require('b5-calculate-score');
const getResult = require('@alheimsins/b5-result-text')

module.exports = async function (request, reply) {
    try {
        const { answers } = await request.payload.answers;
        const scores = calculateScore(answers);
        reply({ data: getResult({ scores, lang: data.lang || 'en' }) });
    } catch (error) {
        throw error
    }
}