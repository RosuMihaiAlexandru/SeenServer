const Boom = require("boom");
const User = require("../models/User");
const getMessageSenderWithChat = require("../handlers/getMessageSenderWithChat");
const mongoose = require("mongoose");

module.exports = async function (request, reply) {
    var userSenderId = request.params.userSenderId.toString();
    var userReceiverId = request.params.userReceiverId.toString();
    reply(getMessageSenderWithChat(userSenderId, userReceiverId));
};
