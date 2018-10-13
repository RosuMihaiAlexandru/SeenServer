const Boom = require('boom');
const User = require('../models/User');
const MembersChat = require('../models/MembersChat');

module.export = async function (request,reply) {
    await User.findOne({ email: request.auth.credentials.email }).populate('conversations').then(
        (User)=>{
            if(User){
                const conversationExists=User.conversations.filter(conversation=>(
                    conversation.members[0]==request.payload.secondUserId||
                    conversation.members[1]==request.payload.secondUserId
                ),
                ).length>0;
                if(conversationExists){
                    //just return or something
                    reply(Boom.badData('You already have conversation with this user'));
                }
                else{
                    User.findById(request.payload.secondUserId).then(
                        (secondUser)=>{
                            const newConversation=new MembersChat({
                                members: [
                                    User._id,
                                    secondUser._id
                                ],
                                matchDate: Date.now(),
                                user1LastSeen: Date.now(),
                                user2LastSeen: Date.now()
                            });
                                newConversation.save().then((conversation)=>{
                                User.conversation.push(conversation);
                                User.save();
                                secondUser.conversation.push(conversation);
                                secondUser.save();

                                reply({ id: conversation._id,secondUserId: secondUser._id});
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