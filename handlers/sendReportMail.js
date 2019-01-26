var nodemailer = require("nodemailer");

module.exports = async function(request, reply) {
  var body = request.payload.body;
  var senderName = request.payload.senderName;

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
    subject: "Report from " + senderName,
    text: body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      reply({ status: "failed"})
    } else {
      console.log('Email sent: ' + info.response);
      reply({ status: "success"})
    }
  });
};
