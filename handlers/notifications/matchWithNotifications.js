const createOrUpdateMatch=require('../createOrUpdateMatch');
const NotificationsProcessor = require("../../notifications/NotificationsProcessor")
const PushMessage = require("../../models/PushMessage")

module.exports = async function (request, reply) {
    const match = await createOrUpdateMatch(request, reply);
    if (match.user1Liked && match.user2Liked) {
        var member1PlayerIds = request.payload.member1PlayerIds;
        var member2PlayerIds = request.payload.member2PlayerIds;
        var member1Name = request.payload.member1Name;
        var member2Name = request.payload.member2Name;
         
          var message1 = { 
            app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
            contents: {"en": member2Name + ' likes you too!'},
            include_player_ids: member1PlayerIds
          };

          var message2 = { 
            app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
            contents: {"en": member1Name + ' likes you too!'},
            include_player_ids: member2PlayerIds
          };
          NotificationsProcessor.process(message1);
          NotificationsProcessor.process(message2);

    }
    reply(match);
}