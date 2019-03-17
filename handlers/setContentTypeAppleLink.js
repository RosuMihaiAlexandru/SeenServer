
const fs = require('fs');

module.exports = async function (request, reply) {
    try {
        var aasa = fs.readFileSync('../../../mnt/apple-app-site-association');
        app.get('/apple-app-site-association', function(req, res, next) {
             res.set('Content-Type', 'application/json');
             res.status(200).send(aasa);
        });   
    } catch (error) {
        reply(error);
    }
}
