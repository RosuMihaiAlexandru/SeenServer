const Boom = require("boom");
const User = require("../models/User");
const Logger = require("../helpers/Logger");
var iap = require('iap');

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var purchase = JSON.parse(request.payload.purchase);
    var isSubscription = request.payload.isSubscription;

    var payment = {
        receipt: purchase.transactionReceipt, // always required
        productId: purchase.productId,
        packageName: purchase.packageName,
        secret: 'e386c102803f4c44be909f47c10bf72e',
        subscription: isSubscription,	// optional, if google play subscription
        keyObject: { "installed": { "client_id": "449463638214-bbscpkp0epb6imlofr9pacjtfh6ov93a.apps.googleusercontent.com", "project_id": "seen-1541339058980", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_secret": "JxT1ZV56g4ck8oPVCrPtkdTr", "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"] } }, // required, if google
    };


    await User.findOne({ _id: loggedInUserId }, function (error, user) {
        if (error) {
            Logger.logErrorAndWarning(loggedInUserId, error);
        }

        if (user) {
            user.paymentInfo.purchases.push(purchase);
            user.save(function (err) {
                if (err) {
                    reply(Boom.notFound("Error updating the User")).code(500);
                }
            });

            iap.verifyPayment(purchase.platform, payment, function (error, response) {
                /* your code */
                if (error) {

                    reply({
                        status: "failure", error: error
                    });
                }

                else {
                    reply({
                        status: "success"
                    });
                }
            });
        }
    });
};
