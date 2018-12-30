const Conversation = require('../models/MembersChat');
const Message = require('../models/Message');
const MembersChat = require('../models/MembersChat');
const addUnreadConversation = require('./addUnreadConversation');

module.exports = (messageRequest)=>{
  const senderId = messageRequest.message.fromUser.userId;
  const receiverId = messageRequest.receiverId;
  const senderName = messageRequest.message.fromUser.displayName;

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
  
  if(!messageRequest.receiverIsOnChat){
    return addUnreadConversation(receiverId, senderId);
  }
};
