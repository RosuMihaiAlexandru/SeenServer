const bcrypt=require('bcryptjs');
const Boom=require('boom');
const JWT=require('jsonwebtoken');
const  User=require('../models/User');
const config=require('../config');
const Logger=require("../helpers/Logger");
const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

const getHashedPassword = (password) => {
  var saltRounds = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

module.exports= async function (request, reply) {
  const loggedInUserId = request.payload.loggedInUserId;
  await User.findOne({ _id: loggedInUserId },
    function(error, user){
      if(error) {
        Logger.logErrorAndWarning(loggedInUserId, error);
      }

      if (user) {
        const hashedPassword = getHashedPassword(request.payload.password);
        user.userPassword = hashedPassword;
        user.save((err, user) => {
          Logger.logErrorAndWarning(loggedInUserId, error);
        });
        const token = JWT.sign({ email: user.email }, secret, { expiresIn });
        reply({ token });
      }
      else if(!user){
        reply(Boom.conflict('User could not be found'));
      }
    });
}