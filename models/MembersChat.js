const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    messages: [
        {
            text: String,
            createdAt: Date,
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