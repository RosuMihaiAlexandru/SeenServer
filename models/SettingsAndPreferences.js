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
    }],
    emailSettings: {
        isReceiveNewMessages: {
            type: Boolean,
            default: true
        },
        isReceiveNewLikes: {
            type: Boolean,
            default: true
        },
        isReceiveNewMatches: {
            type: Boolean,
            default: true
        },
        isReceiveSeenPromotions: {
            type: Boolean,
            default: true
        },
        isVerifiedEmail: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = mongoose.model('SettingsAndPreferences', SettingsAndPreferencesSchema, 'SettingsAndPreferences');