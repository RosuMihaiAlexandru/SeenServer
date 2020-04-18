module.exports = {
    filterUsersByLastAnsweredDate(filteredUsers, user, loggedInUserId) {
        if (user.Chat.length > 0) {
            if (user.Chat[0].members[0] == loggedInUserId) {
                if (user.Chat[0].user1Answered && !user.Chat[0].user1Liked) {
                    var dateNow = Date.now();
                    var lastDateAnswered = new Date(user.Chat[0].user1AnsweredDate);
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

                else if (!user.Chat[0].user1Answered) {
                    if (user.Chat[0].length > 0) {
                        if (user.Chat[0].messages.length > 20) {
                            user.Chat[0].messages.splice(0, user.Chat[0].messages.length - 21);
                        }
                    }
                    filteredUsers.push(user);
                }
            }

            else if (user.Chat[0].members[1] == loggedInUserId) {
                if (user.Chat[0].user2Answered && !user.Chat[0].user2Liked) {
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

                else if (!user.Chat[0].user2Answered) {
                    if (user.Chat[0].length > 0) {
                        if (user.Chat[0].messages.length > 20) {
                            user.Chat[0].messages.splice(0, user.Chat[0].messages.length - 21);
                        }
                    }
                    filteredUsers.push(user);
                }
            }
        }
        else {
            filteredUsers.push(user);
        }
    }
}