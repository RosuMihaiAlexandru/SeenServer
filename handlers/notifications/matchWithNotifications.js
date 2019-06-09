const createOrUpdateMatch = require("../createOrUpdateMatch");
const getPeopleWhoILikeNumberWithoutChats = require("../getPeopleWhoILikeNumberWithoutChats");
const NotificationsProcessor = require("../../notifications/NotificationsProcessor");
const PushMessage = require("../../models/PushMessage");

module.exports = async function(request, reply) {
  const match = await createOrUpdateMatch(request, reply);
  var totalLikesNumber = await getPeopleWhoILikeNumberWithoutChats(request, reply);
  var member1PlayerIds = request.payload.member1PlayerIds;
  var member2PlayerIds = request.payload.member2PlayerIds;
  var member1Name = request.payload.member1Name;
  var member2Name = request.payload.member2Name;
  var member1Id = request.payload.member1;
  var member2Id = request.payload.member2;
  var userSawTheOther = request.payload.userSawTheOther;

  match.totalLikesNumber = totalLikesNumber;
  if (match.user1Liked && match.user2Liked) {
    var message1 = {
      app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
      contents: { en: member2Name + " likes you too!" },
      data: {
        notificationType: "match",
        senderId: member2Id
      },
      include_player_ids: member1PlayerIds
    };

    var message2 = {
      app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
      contents: { en: member1Name + " likes you too!" },
      data: {
        notificationType: "match",
        senderId: member1Id
      },
      include_player_ids: member2PlayerIds
    };
    NotificationsProcessor.process(message1);
    NotificationsProcessor.process(message2);
  } else if (match.user1Liked) {
    var contents = userSawTheOther
      ? "Someone nearby thinks you are cute!"
      : "Someone new likes you!";
    var message = {
      app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
      contents: { en: contents },
      data: {
        notificationType: "like",
        senderId: member1Id
      },
      include_player_ids: member2PlayerIds
    };
    NotificationsProcessor.process(message);
  } else if (match.user2Liked) {
    var contents = userSawTheOther
      ? "Someone nearby thinks you are cute!"
      : "Someone new likes you!";
    var message = {
      app_id: "e8d3a93c-398c-407d-9219-8131322767a0",
      contents: { en: contents },
      data: {
        notificationType: "like",
        senderId: member2Id
      },
      include_player_ids: member1PlayerIds
    };
    NotificationsProcessor.process(message);
  }
  reply(match);
};
