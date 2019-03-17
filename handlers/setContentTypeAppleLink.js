
const fs = require('fs');

module.exports = async function (request, reply) {
    var aasa = fs.readFileSync('../../../../mnt/.wellknown/apple-app-site-association');
    app.get('/apple-app-site-association', function(req, res, next) {
         res.set('Content-Type', 'application/json');
         res.status(200).send(aasa);
    });
}
