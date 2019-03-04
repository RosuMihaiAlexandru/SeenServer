// routes.js
const handlers = require('../handlers/modules');

module.exports = [
    {
        //creates a feedback element inside feedback array from LogInfo document
        method: 'POST',
        path: '/',
        handler: handlers.logFeedback,
        config: {
            auth: false,
        }
    }
];

