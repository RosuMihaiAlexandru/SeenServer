const Boom = require("boom");
const Match = require("../models/MembersChat");
const Logger = require("../helpers/Logger");

module.exports = async function(request, reply) {
  var member1 = request.payload.member1;
  var member2 = request.payload.member2;
  var userLiked = request.payload.userLiked;
  var userSawTheOther = request.payload.userSawTheOther;

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
        } else if (match.members[1]._id.toString() === member1) {
          match.user2Liked = userLiked;
          if (userSawTheOther) {
            match.user2SawTheOther = true;
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
            user2SawTheOther: match.user2SawTheOther
          });
        });
      } else {
        var newMatch = {
          members: [member1, member2],
          user1Liked: userLiked,
          user1SawTheOther: userSawTheOther
        };
        Match.create(newMatch);

        resolve({
          members: newMatch.members,
          matchDate: newMatch.matchDate,
          user1Liked: newMatch.user1Liked,
          user2Liked: newMatch.user2Liked,
          user1SawTheOther: match.user1SawTheOther,
          user2SawTheOther: match.user2SawTheOther
        });
      }
    });
  });
};
