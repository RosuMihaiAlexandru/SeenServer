
module.exports = {

    async submit(body, senderName, subject) {
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
            to: "seen.reportservice@gmail.com",
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
    }
}