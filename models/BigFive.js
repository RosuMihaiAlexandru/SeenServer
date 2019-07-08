const mongoose = require('mongoose');

const BigFiveSchema = new mongoose.Schema({
    text: String,
    keyed: [],
    domain: String,
    facet: String,
    num: Boolean,
    choices: []
});

module.exports = mongoose.model('BigFive', BigFiveSchema, 'BigFive');