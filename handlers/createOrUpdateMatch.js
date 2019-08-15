const Boom = require("boom");
const Match = require("../models/MembersChat");
const Logger = require("../helpers/Logger");

module.exports = async function(request, reply) {
  var member1 = request.payload.member1;
  var member2 = request.payload.member2;
  var userLiked = request.payload.userLiked;
  var userSawTheOther = request.payload.userSawTheOther;
  var giftKey = request.payload.giftKey;

  return new Promise(function(resolve, reject) {
    Match.findOne({ members: { $all: [member1, member2] } }, function(
      error,
      match
    ) {
      if (error) {
        Logger.logErrorAndWarning(member1, error);
        reject(err);
      }

      if (match) {
        if (match.members[0]._id.toString() === member1) {
          match.user1Liked = userLiked;
          if (userSawTheOther) {
            match.user1SawTheOther = true;
          }
          if(giftKey !== ""){
            match.user2ReceivedGifts.push(giftKey);
          }
        } else if (match.members[1]._id.toString() === member1) {
          match.user2Liked = userLiked;
          if (userSawTheOther) {
            match.user2SawTheOther = true;
          }
          if(giftKey !== ""){
            match.user1ReceivedGifts.push(giftKey);
          }
        }

        if (match.user1Liked && match.user2Liked) {
          match.matchDate = Date.now();
        }

        match.save(function(err) {
          if (err) {
            Logger.logErrorAndWarning(member1, err);
            reject(err);
            reply(Boom.notFound("Error updating the UserMatches"));
          }

          resolve({
            id: match._id,
            members: match.members,
            matchDate: match.matchDate,
            user1Liked: match.user1Liked,
            user2Liked: match.user2Liked,
            user1SawTheOther: match.user1SawTheOther,
            user2SawTheOther: match.user2SawTheOther,
            user1ReceivedGifts: match.user1ReceivedGifts,
            user2ReceivedGifts: match.user2ReceivedGifts
          });
        });
      } else {
        var user2ReceivedGifts = [giftKey];
        var newMatch = {
          members: [member1, member2],
          user1Liked: userLiked,
          user2Liked: false,
          user1SawTheOther: userSawTheOther,
          user2SawTheOther: false,
          user1ReceivedGifts: [],
          user2ReceivedGifts: user2ReceivedGifts
        };
        Match.create(newMatch).then(function() {
          resolve({
            members: newMatch.members,
            matchDate: newMatch.matchDate,
            user1Liked: newMatch.user1Liked,
            user2Liked: newMatch.user2Liked,
            user1SawTheOther: newMatch.user1SawTheOther,
            user2SawTheOther: newMatch.user2SawTheOther,
            user1ReceivedGifts: user1ReceivedGifts,
            user2ReceivedGifts: user2ReceivedGifts
          });
        });
      }
    });
  });
};
