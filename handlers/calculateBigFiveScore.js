const calculateScore = require('b5-calculate-score');
const getResult = require('@alheimsins/b5-result-text')

module.exports = async function (request, reply) {
    try {
        const result =  { answers: JSON.parse(request.payload.answers) };
        const scores = calculateScore(result);
        reply({ data: getResult({ scores, lang: 'en' }) });
    } catch (error) {
        throw error
    }
}