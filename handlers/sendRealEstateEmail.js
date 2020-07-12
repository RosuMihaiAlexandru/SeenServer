var EmailSender = require('../helpers/EmailSender');
module.exports = async function (request, reply) {
    var body = request.payload.body;
    var senderName = request.payload.senderName;
    var phoneNumber = request.payload.phoneNumber;
    var email = request.payload.email;
    var subject = "Mesaj de la: " + senderName + ",email: "+ email + ",nr telefon: " + phoneNumber;
    var sendTo = "alexandra@virtualestate.com";
    var sentStatus = await EmailSender.submit(body, senderName, subject, sendTo);
    reply(sentStatus);
};
