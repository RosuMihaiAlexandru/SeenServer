const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    messages: [
        {
            msgType: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
            text: String,
            mediaPath: String,
            duration: String,
            user: {
                _id: String,
                name: String
            }
        }
    ],
    matchDate: Date,
    user1LastSeenDate: Date,
    user2LastSeenDate: Date,
    user1Liked: {
        type: Boolean,
        default: false
    },
    user2Liked: {
        type: Boolean,
        default: false
    },
    user1Blocked: {
        type: Boolean,
        default: false
    },
    user2Blocked: {
        type: Boolean,
        default: false
    },
    user1DeleteDate: {
        type: Date,
        default: Date.now,
    },
    user2DeleteDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('MembersChat', ConversationSchema, 'MembersChat');