
module.exports = {

    async submit(body, senderName, subject) {
        var status = '';
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
            to: "seen.reportservice@gmail.com",
            subject: subject,
            text: body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                status = { status: "failed" }
            } else {
                console.log('Email sent: ' + info.response);
                status = { status: "success" };
            }
        });
        return status;
    }
}