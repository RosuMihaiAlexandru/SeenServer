const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: String,
    userPassword: String,
    gender: String,
    email: String,
    birthDate: Date,
    city: String,
    height: String,
    ethnicity: String,
    religion: String,
    occupation: String,
    education: String,
    about: String,
    weakness: String,
    enjoys: String,
    location: {
        //type:'Point',
        coordinates: [
            {
                type: Number,
                default: 0
            }
        ]
    },
    favouriteLocation: {
        //type:'Point',
        coordinates: [
            {
                type: Number,
                default: 0
            }
        ]
    },
    userImages: [
        {
            contentType: String,
            media: String
        }
    ],
    profileImage: {
        contentType: String,
        media: String
    },
    coverImage: {
        contentType: String,
        media: String
    }
});

module.exports = mongoose.model('User', UserSchema, 'User');