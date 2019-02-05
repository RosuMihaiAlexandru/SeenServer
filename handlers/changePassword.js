const bcrypt=require('bcryptjs');
const Boom=require('boom');
const JWT=require('jsonwebtoken');
const  User=require('../models/User');
const config=require('../config');
const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

const getHashedPassword = (password) => {
  var saltRounds = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

module.exports= async function (request, reply) {
  await User.findOne({ _id: request.payload.loggedInUserId }).then(
    (user) => {
      if (user) {
        const hashedPassword = getHashedPassword(request.payload.password);
        user.password = hashedPassword;
        user.save((err, user) => {
          console.log(err);
        });
        const token = JWT.sign({ email: user.email }, secret, { expiresIn });
        reply({ token });
      }
      else if(!user){
        reply(Boom.conflict('User could not be found'));
      }
    });
}