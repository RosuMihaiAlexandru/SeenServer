const bcrypt=require('bcrypt');
const Boom=require('boom');
const JWT=require('jsonwebtoken');


const  User=require('../models/User');
const config=require('../config');
const sanitizeUser=require('../helpers/sanitizeUser');

const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

const getHashedPassword = (password) => {
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

module.exports= async function (request, reply) {
  let newUser;
  await User.findOne({ email: request.payload.email }).then(
    (user) => {
      if (!user) {
        const hashedPassword = getHashedPassword(request.payload.password);
        newUser = new User({
          userName: request.payload.userName,
          email: request.payload.email,
          userPassword: hashedPassword,
        });
        newUser.save((err) => { console.log(err); });
        const token = JWT.sign({ email: newUser.email }, secret, { expiresIn });
        reply({ token, user: sanitizeUser(newUser) });
      }
      reply(Boom.conflict('User already exists'));
    });
}