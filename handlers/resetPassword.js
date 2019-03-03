var EmailSender = require("../helpers/EmailSender");
const User = require("../models/User");
var crypto = require("crypto");
const generatePassword = require("../helpers/passwordGenerator");
const bcrypt=require('bcryptjs');

const getHashedPassword = (password) => {
    var saltRounds = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
};

module.exports = async function(request, reply) {
  var token = request.payload.token;
  await User.findOne({
    where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }
  }).then(user => {
    if (user) {
        var newPassword = generatePassword(8);
        var newPasswordHashed = getHashedPassword(newPassword);
        user.resetPasswordToken = "";
        user.password = newPasswordHashed;
        user.save(function(err){
            if(err){
                reply({
                    status: 'failed',
                    reason: err
                })
            }
            else{
                var body = 'Hello from Seen';
                var sendTo = user.email;
                var subject = "Your password has been reset";
                var html = '<!DOCTYPE html>' +
                '<html><head><title>Blank</title>' +
                '</head><body>' +
                '<div style="padding-bottom:37px;border-bottom:2px solid #e5e5e5"><div style="color:#085078;font-family: montserrat,arial,sans-serif;font-size:18px;line-height:24px;text-align:center;font-weight:bold;background-color:white">' +
                '<span style="color:#085078;text-decoration:none;">Your new password is ' + newPassword + '.</br></br>You are advised to change this password with a new one when possible.</span></div></div>' +
                '<div style="padding:30px 0;color:#7c7c7c;font-family:Montserrat,Arial,sans-serif;font-size:11px;line-height:20px;text-align:center"> This email was sent by Seen.<br> 54 Springleaze, Bristol, United Kingdom, BS4 2TT<br> ©2018 Seen Corp LTD. | <a href="https://theseenapp.com" style="color:#7c7c7c;text-decoration:none" target="_blank"><span style="color:#7c7c7c;text-decoration:none">Privacy Policy</span></a> <br> </div></body></html>'
                var sentStatus = EmailSender.submitWithHtml(body, html, subject, sendTo).then( res =>{
                    reply(res);
                });
            }
        })
    }
    else {
        reply({
            status: 'failed',
            reason: 'Password reset link is invalid or has expired'
        }).code(404);
    }
  });
};
