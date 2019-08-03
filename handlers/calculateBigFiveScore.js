const calculateScore = require('b5-calculate-score');
const getResult = require('@alheimsins/b5-result-text')

module.exports = async function (request, reply) {
    try {
        const { data } = await request.query.data;
        const scores = calculateScore(data.answers);
        reply({ data: getResult({ scores, lang: data.lang || 'en' }) });
    } catch (error) {
        throw error
    }
}