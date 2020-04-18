module.exports = {
    filterUsersByLastAnsweredDate(filteredUsers, user) {
        if (user.Chat.members[0] == loggedInUserId) {
            if (user.Chat.user1Answered && !user.Chat.user1Liked) {
                var dateNow = Date.now();
                var lastDateAnswered = new Date(user.Chat.user1AnsweredDate);
                var lastAnsweredPassedDays = Math.floor((Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()) -
                    Date.UTC(lastDateAnswered.getFullYear(), lastDateAnswered.getMonth(), lastDateAnswered.getDate())) / (1000 * 60 * 60 * 24));
                if (lastAnsweredPassedDays > 4) {
                    if (user.Chat.length > 0) {
                        if (user.Chat[0].messages.length > 20) {
                            user.Chat[0].messages.splice(0, user.Chat[0].messages.length - 21);
                        }
                    }
                    filteredUsers.push(user);
                }
            }

            else if (!user.Chat.user1Answered) {
                if (user.Chat.length > 0) {
                    if (user.Chat[0].messages.length > 20) {
                        user.Chat[0].messages.splice(0, user.Chat[0].messages.length - 21);
                    }
                }
                filteredUsers.push(user);
            }
        }

        else if (user.Chat.members[1] == loggedInUserId) {
            if (user.Chat.user2Answered && !user.Chat.user2Liked) {
                var dateNow = Date.now();
                var lastDateAnswered = new Date(user.Chat.user2AnsweredDate);
                var lastAnsweredPassedDays = Math.floor((Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()) -
                    Date.UTC(lastDateAnswered.getFullYear(), lastDateAnswered.getMonth(), lastDateAnswered.getDate())) / (1000 * 60 * 60 * 24));
                if (lastAnsweredPassedDays > 4) {
                    if (user.Chat.length > 0) {
                        if (user.Chat[0].messages.length > 20) {
                            user.Chat[0].messages.splice(0, user.Chat[0].messages.length - 21);
                        }
                    }
                    filteredUsers.push(user);
                }
            }

            else if (!user.Chat.user2Answered) {
                if (user.Chat.length > 0) {
                    if (user.Chat[0].messages.length > 20) {
                        user.Chat[0].messages.splice(0, user.Chat[0].messages.length - 21);
                    }
                }
                filteredUsers.push(user);
            }
        }
    }
}