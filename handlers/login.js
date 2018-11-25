const JWT=require('jsonwebtoken');
const Boom=require('boom');
const bcrypt=require('bcrypt');
const User=require('../models/User');
const config=require('../config');
const sanitizeUser=require('../helpers/sanitizeUser');


const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

module.exports= function login({
  headers,
  payload: { email, password },
  }, 
  reply) {
  User.findOne({ email }).then(
    (user) => {
      if (!user) {
        return reply(Boom.notFound('Wrong email or password'));
      }

      const passwordMatch = bcrypt.compareSync(password, user.userPassword);
      if (!passwordMatch) {
        return reply(Boom.unauthorized('Wrong email or password'));
      }

      const token = JWT.sign({ email: user.email }, secret, { expiresIn });
      return reply({ token, user: user });  
    });
}