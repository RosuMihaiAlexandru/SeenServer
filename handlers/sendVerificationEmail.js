var EmailSender = require('../helpers/EmailSender');
module.exports = async function (request, reply) {
    var body = 'Hello from Mihai';
    var sendTo = request.payload.sendTo;
    var subject = "Verify Your Email";
    var html = '<!DOCTYPE html>'+
    '<html><head><title>Please verify your email to secure your acount</title>'+
    '</head><body><div>'+
    '<a href="https://theseenapp.com/verifyEmail">Verify Email</a>'+
    '</div></body></html>'
    var sentStatus = await EmailSender.submitWithHtml(body, html, subject, sendTo);
    reply(sentStatus);
};
