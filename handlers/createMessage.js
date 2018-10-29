const Conversation = require('../models/MembersChat');
const Message = require('../models/Message');
const MembersChat = require('../models/MembersChat');

module.exports = (messageRequest)=>{

  const textMessage = new Message({
    text: messageRequest.message.text,
    user: { _id: messageRequest.message.user._id },
  });

  Conversation.findOne({ members: [messageRequest.message.user._id,messageRequest.receiverId]}).then(
    (conversation) => {
        if(!conversation){
          const newConversation=new MembersChat({
            members: [
               messageRequest.message.user._id,
               messageRequest.receiverId
            ],
            matchDate: null,
            user1LastSeenDate: null,
            user2LastSeenDate: null,
            user1Liked: null,
            user2Liked: null
          });
          newConversation.messages.push(textMessage);
          newConversation.save();
        }
        else{
        conversation.messages.push(textMessage);
        conversation.save();
      }
      }
  )
};
