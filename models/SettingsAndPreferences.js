const mongoose = require('mongoose');

const SettingsAndPreferencesSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isShowMen: {
        type: Boolean,
        default: true
    },
    isShowWomen: {
        type: Boolean,
        default: true
    },
    ageRange: [{
        type: Number
    }],
    locationRange: [{
        type: Number
    }]
});

module.exports = mongoose.model('SettingsAndPreferences', SettingsAndPreferencesSchema, 'SettingsAndPreferences');