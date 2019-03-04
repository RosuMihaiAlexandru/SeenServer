const mongoose = require('mongoose');

const LogInfoSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    errorAndWarningsLog: [
        {
            errorTime:{
                type: Date,
                default: Date.now,
            },
            errorMessage: String
        }
    ],
    feedbackLog: [
        {
            feedbackTime:{
                type: Date,
                default: Date.now,
            },
            feedbackList: []
        }
    ],
    deleteLog: [
        {
            deleteTime:{
                type: Date,
                default: Date.now,
            },
            deleteReasonList: []
        }
    ]
});

module.exports = mongoose.model('LogInfo', LogInfoSchema, 'LogInfo');