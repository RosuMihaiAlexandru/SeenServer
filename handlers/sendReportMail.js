var EmailSender = require('../helpers/EmailSender');
module.exports = async function (request, reply) {
    var body = request.payload.body;
    var senderName = request.payload.senderName;
    var subject = "Report from " + senderName;
    var sendTo = "seen.reportservice@gmail.com";
    var sentStatus = await EmailSender.submit(body, senderName, subject, sendTo);
    reply(sentStatus);
};
