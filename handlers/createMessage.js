const Conversation = require('../models/MembersChat');
const Message = require('../models/Message');
const MembersChat = require('../models/MembersChat');

module.exports = (messageRequest)=>{
  const senderId = messageRequest.message.user._id;
  const receiverId = messageRequest.receiverId;
  const senderName = messageRequest.message.user.name;

  const textMessage = new Message({
    text: messageRequest.message.text,
    user: {
       _id: senderId,
       name: senderName
      },
  });

  Conversation.findOne({ members:{ $all: [ senderId, receiverId ]}}).then(
    (conversation) => {
        if(!conversation){
          const newConversation=new MembersChat({
            members: [
               senderId,
               receiverId
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
