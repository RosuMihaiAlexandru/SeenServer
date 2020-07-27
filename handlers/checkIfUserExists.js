const User = require('../models/User');

module.exports = async function (request, reply) {
    const email = request.query.email;

    User.findOne({ email: email }, function (err, user) {
        if (err) {
            reply({status: 'failure', exists: false});
            return;
        }

        if (user) {
            reply({status: 'success', exists: true});         
        } else {
            reply({status: 'success', exists: false});
        }
    });
}