const mongoose = require('mongoose');

const ConversationSchema=new mongoose.Schema({
    members: [
        String
    ],
    messages:[
        {
            author: String,
            body: String,
            sendDate: Date
        }
    ],
    matchDate: Date,
    user1LastSeenDate: Date,
    user2LastSeenDate: Date
});

module.exports=mongoose.model('MembersChat',ConversationSchema,'MembersChat');