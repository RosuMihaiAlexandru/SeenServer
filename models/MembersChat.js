const mongoose = require('mongoose');

const ConversationSchema=new mongoose.Schema({
    members: [
        String
    ],
    messages:[
        {
            text: String,
            createdAt: Date,
            user:{
                _id: String,
                name: String
            }
        }
    ],
    matchDate: Date,
    user1LastSeenDate: Date,
    user2LastSeenDate: Date
});

module.exports=mongoose.model('MembersChat',ConversationSchema,'MembersChat');