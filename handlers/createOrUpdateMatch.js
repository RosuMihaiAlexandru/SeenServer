const Boom = require("boom");
const Match = require("../models/MembersChat");

var id1 = "5bc25f985284a0186c6bff6b",
    id2 = "5bbd17cf23d76f2974697db8";

module.exports = async function (request, reply) {
    var member1 = request.payload.member1;
    var member2 = request.payload.member2;
    var userLiked = request.payload.userLiked;

    await Match.findOne({ members: { $all: [member1, member2] } }).then(match => {
        if (match) {
            if (match.members[0]._id.toString() === member1) {
                match.user1Liked = userLiked;
            } else if (match.members[1]._id.toString() === member1) {
                match.user2Liked = userLiked;
            }

            if (match.user1Liked && match.user2Liked) {
                match.matchDate = Date.now();
            }

            match.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the UserMatches"));
                }
            });

            reply({
                id: match._id,
                members: match.members,
                matchDate: match.matchDate,
                user1Liked: match.user1Liked,
                user2Liked: match.user2Liked
            }).code(200);
        } else {
            var newMatch = {
                members: [member1, member2],
                messages: null,
                matchDate: null,
                user1LastSeenDate: null,
                user2LastSeenDate: null,
                user1Liked: userLiked,
                user2Liked: null
            };
            Match.create(newMatch);

            reply({
                members: newMatch.members,
                matchDate: newMatch.matchDate,
                user1Liked: newMatch.user1Liked,
                user2Liked: newMatch.user2Liked
            }).code(201);
        }
    });
};
