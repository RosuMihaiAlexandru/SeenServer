
const Boom = require('boom');
const User = require('../models/User');
const MembersChat = require('../models/MembersChat');

module.export = async function (request,reply) {
    await User.findOne({ email: request.auth.credentials.email }).populate('conversations').then(
        (User)=>{
            if(User){
                const conversationExists=User.conversations.filter(conversation=>(
                    conversation.members[0]==request.payload.friendId||
                    conversation.members[1]==request.payload.friendId
                ),
                ).length>0;
                if(conversationExists){
                    //just return or something
                    reply(Boom.badData('You already have conversation with this user'));
                }
                else{
                    User.findById(request.payload.friendId).then(
                        (friend)=>{
                            const newConversation=new MembersChat({
                                members: [
                                    User._id,
                                    friend._id
                                ],
                                messages:[],
                                matchDate: Date.now,
                                user1LastSeen: Date.now,
                                user2LastSeen: Date.now
                            });
                                newConversation.save().then((conversation)=>{
                                User.conversation.push(conversation);
                                User.save();
                                friend.conversation.push(conversation);
                                friend.save();

                                reply({ id: conversation._id,friendId: friend._id});
                            });
                        },
                    );
                }
            }
            else{
                reply(Boom.notFound('Cannot find user'));
            }
        },
    );
}