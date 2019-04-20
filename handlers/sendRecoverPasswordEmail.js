var EmailSender = require('../helpers/EmailSender');
const User = require('../models/User');
var crypto = require('crypto');
const Logger = require("../helpers/Logger");

module.exports = async function (request, reply) {
    var body = 'Hello from Seen';
    var sendTo = request.payload.email;
    var subject = "Password reset";
    
    await User.findOne({ email: sendTo }, function(error, user) {
        if(user){
            var token = crypto.randomBytes(20).toString('hex');
            var html = '<!DOCTYPE html>' +
            '<html><head><title>Please verify your email to secure your acount</title>' +
            '</head><body>' + '<div style="padding-bottom:37px;border-bottom:2px solid #e5e5e5"><div style="color:#085078;font-family: montserrat,arial,sans-serif;font-size:34px;line-height:48px;text-align:center;font-weight:bold;background-color:white">' +

            '<span style="color:#085078;text-decoration:none;">Reset your password</span></div></div>' +

            '<div style="margin-top:37px; border-radius:30px;padding:15px 30px;color:#ffffff;font-family:Montserrat,Arial,sans-serif;font-size:14px;line-height:18px;text-align:center;letter-spacing:2px;text-transform:uppercase; background-color:#085078"> <a href="https://theseenapp.com/reset-password/' + token +'" rel="noopener noreferrer" style="color:#ffffff;text-decoration:none" target="_blank"><span style="color:#ffffff;text-decoration:none">RESET PASSWORD</span></a> </div>' +

            '<div style="padding:30px 0;color:#7c7c7c;font-family:Montserrat,Arial,sans-serif;font-size:11px;line-height:20px;text-align:center"> This email was sent by Seen.<br> 54 Springleaze, Bristol, United Kingdom, BS4 2TT<br> ©2018 Seen Corp LTD. | <a href="https://theseenapp.com" style="color:#7c7c7c;text-decoration:none" target="_blank"><span style="color:#7c7c7c;text-decoration:none">Privacy Policy</span></a> <br> </div></body></html>'
 
            var sentStatus = EmailSender.submitWithHtml(body, html, subject, sendTo).then( res =>
            {
                if(res.status == 'success'){
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 360000;
                    user.save(function (err) {
                        if (err) {
                            Logger.logErrorAndWarning(user._id, err);
                            reply({
                                status: 'failure',
                                reason: err
                            });
                        }
                        else{
                            reply(res);
                        }
                    });
                }
                
            });
           
        }
        else{
            reply({
                status: 'failure',
                reason: 'This email is not registered'
            })
        }
    });
};
