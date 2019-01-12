const JWT=require('jsonwebtoken');
const User=require('../models/User');
const config=require('../config');
const sanitizeUser=require('../helpers/sanitizeUser');


const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

module.exports= function login({
  headers,
  payload: { email, name, profileImage, birthDate },
  }, 
  reply) {
  User.findOne({ email }).then(
    (user) => {
      if (!user) {
        let newUser = new User({
            location: {
                type: 'Point',
                coordinates:[
                  51.5194657,
                  -0.102699
                ]
            },
            unreadConversations: [],
            playerIds: [],
            favouriteLocation: '',
            userName: name,
            email: email,
            userPassword: '',
            gender: '',
            birthDate: birthDate,
            city: '',
            height: '',
            ethnicity: '',
            religion: '',
            occupation: '',
            education: '',
            about: '',
            weakness: '',
            enjoys: '',
            userImages: [],
            profileImage: {
              contentType: 'image/jpg',
              media: profileImage
            },
            coverImage: {
              contentType: 'image/jpg',
              media: ''
            }
          });
          newUser.save((err) => { console.log(err); });
          const token = JWT.sign({ email: newUser.email }, secret, { expiresIn });
          return reply({ token, user: newUser }); 
      }else {
      const token = JWT.sign({ email: user.email }, secret, { expiresIn });
      return reply({ token, user: user });
      }  
    });
}