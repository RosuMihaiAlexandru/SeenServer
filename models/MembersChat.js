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
    user1Liked: Boolean,
    user2Liked: Boolean
});

module.exports = mongoose.model('MembersChat', ConversationSchema, 'MembersChat');