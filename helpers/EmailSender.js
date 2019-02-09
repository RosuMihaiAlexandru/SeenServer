
module.exports = {

    async submit(body, senderName, subject, sendTo) {
        var status = {};
        var nodemailer = require("nodemailer");
        var body = body;
        var senderName = senderName;

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "seen.reportservice@gmail.com",
                pass: "seenreportservice123"
            }
        });

        var mailOptions = {
            from: "seen.reportservice@gmail.com",
            to: sendTo,
            subject: subject,
            text: body
        };

         await transporter.sendMail(mailOptions).then(result=>{
             if(result.rejected.length == 0 && result.accepted.length > 0)
             {
                status = { status: "success" };
             }
             else{
                status = { status: "failed" };
             }
         })
         
         return status;
    },

    async submitWithHtml(body, html, subject, sendTo) {
        var status = {};
        var nodemailer = require("nodemailer");
        var body = body;

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "seen.reportservice@gmail.com",
                pass: "seenreportservice123"
            }
        });

        var mailOptions = {
            from: "seen.reportservice@gmail.com",
            to: sendTo,
            subject: subject,
            text: body,
            html: html
        };

         await transporter.sendMail(mailOptions).then(result=>{
             if(result.rejected.length == 0 && result.accepted.length > 0)
             {
                status = { status: "success" };
             }
             else{
                status = { status: "failed" };
             }
         })
         
         return status;
    }
}