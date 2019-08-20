const mongoose = require('mongoose');
const userSubscriptionType = require('../constants/userSubscriptionTypes');
const pointSchema = new mongoose.Schema({
    location: {
        type: { type: String },
        coordinates: []
    }
});

// define the index
pointSchema.index({ location: '2dsphere' });

const UserSchema = new mongoose.Schema({
    unreadConversations: [],
    playerIds: [],
    userName: String,
    userPassword: String,
    accountIsHidden: Boolean,
    userSubscriptionType: {
        type: String,
        default: userSubscriptionType.basic,
    },
    paymentInfo: {
        receipts: []
    },
    matchingData: {
        lastDateAnswered: Date,
        questions: [
            {
                question: String,
                answer: String,
                tag: String
            }],
        bigFiveResult: {}
    },
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
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    location: {
        type: { type: String },
        coordinates: []
    },
    favouriteLocation: String,
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
    },
    arData: {
        arGiftsLeft: {
            type: Number,
            default: 10,
        },
        receipts: []
    }
});
UserSchema.index({ "location": '2dsphere' });

module.exports = mongoose.model('User', UserSchema, 'User');