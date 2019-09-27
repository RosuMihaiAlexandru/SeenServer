const Boom = require("boom");
const User = require("../models/User");
const Logger = require("../helpers/Logger");
var iap = require('iap');
const { google } = require('googleapis');
var pub = google.androidpublisher('v2');

module.exports = async function (request, reply) {
    var loggedInUserId = request.payload.loggedInUserId;
    var isSubscription = request.payload.isSubscription;
    var purchase = JSON.parse(request.payload.purchase);
    var userSubscriptionType = request.payload.userSubscriptionType;
    var error = null;

    await User.findOne({ _id: loggedInUserId }, function (err, user) {
        if (error) {
            Logger.logErrorAndWarning(loggedInUserId, err);
            error = err;
            reply({
                status: "failure", error: err
            });
        }

        if (user) {
            if (purchase && !user.paymentInfo.purchases.some(e => e.transactionId === purchase.transactionId)) {
                user.paymentInfo.purchases.push(purchase);

                user.save(function (err) {
                    if (err) {
                        Logger.logErrorAndWarning(loggedInUserId, err);
                    } else {
                    }
                });
            }

            user.paymentInfo.purchases.forEach(purchase => {
                const isPurchasedFromApple = !purchase.dataAndroid;
                const isPurchasedFromAndroid = purchase.dataAndroid;
                if (isPurchasedFromApple) {
                    var payment = {
                        receipt: purchase.transactionReceipt, // always required
                        productId: purchase.productId,
                        packageName: purchase.packageName,
                        secret: 'e386c102803f4c44be909f47c10bf72e',
                        subscription: isSubscription,	// optional, if google play subscription
                        keyObject: {}

                        // required, if google
                    };

                    iap.verifyPayment(purchase.platform, payment, function (err, response) {
                        /* your code */
                        if (err) {
                            error = err;
                        }

                        else {
                            reply({
                                status: "success", isValid: "true"
                            });
                        }

                    });
                }

                if (isPurchasedFromAndroid) {

                    const googleServiceAccountValidatorJson = {
                        "type": "service_account",
                        "project_id": "api-6750173295029392348-608788",
                        "private_key_id": "5f78aa8f88ea90b4590dfc3d017026e1b8d4004f",
                        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCdPpmluYlBYSfO\n8Se+Pu2LCKqaitsfNuU5m/h/fsYYAKUnT2oAL9HA6JAyj6oAoLAR1F3ddY8aw+Ho\nGFRI5J/iMZnhiM3/oGrxrNbiqGl1kk5guYZoV9LoP95/RqzsemVSnEs5CznBlK/P\nUfYYzAd13YWELDjdHj0RVdunEBEddslK7ERHwg+y5gVfOagJzE7IU/GvMfK7Iw/d\n1OErD42gU2PXiEyTSFLLtV1bafuxF47CaCGSci8pLzIJssAHyT8NpG2FzBA3n1iY\nlX6U/ivVZob2qd3iIdWRDEZvf2HQNcFisK09c+U3cXbK2yUuRhlJwqe/J6dUhpuz\net0FQ4dNAgMBAAECggEADiMGpUOc92fIsG416IC30nwg+mvpb1D8IsXG/Y9kN9w2\n/OXC3eluri06aZFI821+5tt05OggyYM62Cb3zOXhCfDzqLcn7gd6Feg4GYCSmqNg\nsIl9b/wVVhQH6OFtwoTufxLWIHbF5oV7mOQBgBE3ynzz+AIRyq9hRiG18bscDs3v\nDsLC6qBdAHJsD/ewAvIzXdylGunDdarxwLnYe2pLsmmR0osk6W03x6Bi2iUndU63\nGByeQPEHtk5+4AZSLgxhQkS/LQOmydoA9MBAQEp6WTGsiabcE++zrRSnt6/ykvwz\nnHhEQwKi8rYxyxDTd2/Uvtr65c3dwNKcAtTXDZni8QKBgQDLFYl7xQ51t3AIUIVX\neG3H+k+X1kIdCN2RRttSAbYC9SkRJ0HaAzrur5dq/lRuBv8KXIsjKQV6fIamozlR\nmKD3K8l5+rzZ2fHbWyVDEcQzG6M83/cNjneovDo2E7/CHAT/7DWnDTeer0geWwEi\nnjR1QXojSahMBF6IpG/Et0XBpwKBgQDGN2RyxPLhB3pPrhXQilJCrKXZ9BkYSNjl\n1pnrZFHCbRDD0v3/qM/9L7+kZLscPj+ahVUoOof2klHE/Z++iaMCmMY0/MW0pkoh\nW0dY3EPDYoRM5g/kihJ4DPEjdgGRU0QbohvAs6wdSK074TnVtlWWL5Km1hgkRu39\nno+eXkmF6wKBgAS3YVQAhY9yTSXESPR5FYOZapPKJArsk8i17o3/AC0daHC/iqX3\ngTzd0xRnB6rueqnQ8GJGp5vqnG3uSHx+oO5ck/dDPXOJvjYr7bebCAVv1OCrCt/D\nuT+v72ImH0PwxqTy5WQVyH7k7zXVQzd8mRdICAAdy8zIJTHjL71PzEztAoGAHjPe\niGZeI8/B4VZDWK1a73HjK5y4Hi0rb4oNlgKJOrjnrw79SPFuD8QwzVnT8O/DPUZH\nvYN9qCKPdxa2OpA6WHDy8qv5bBdSgFaqPm4BnUnrotQDY+1t9wDx1Vdr0bsAS72d\nwPUfqq6iRteAuoG39NR24hkJQK3WIakBdT4ksdUCgYAnqKlMjHxIPtZYWhXJHoEi\nfqVgpD60gW1FpKyqnPc0Am22Ms9P5mVis3bN1qf8eDE8+V3PmEzNratOsn1EoRB0\n6CHOsJ9NZLev1uNrdIZJ4hcgv4Oata8TN1V9g9LPAxaQJloKSE50no/TSv//uJVI\nro0dI9EAeEDlfWItmuHUnQ==\n-----END PRIVATE KEY-----\n",
                        "client_email": "seenservice@api-6750173295029392348-608788.iam.gserviceaccount.com",
                        "client_id": "113820700931231376079",
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/seenservice%40api-6750173295029392348-608788.iam.gserviceaccount.com"
                    }

                    var authClient = new google.auth.JWT(
                        googleServiceAccountValidatorJson.client_email,
                        '',
                        googleServiceAccountValidatorJson.private_key,
                        [
                            'https://www.googleapis.com/auth/androidpublisher'
                        ],
                        ''
                    )

                    authClient.authorize(function (err, response) {
                        if (error) {
                            error = err;
                        }
                        pub.purchases.subscriptions.get({
                            auth: authClient,
                            packageName: purchase.packageName,
                            subscriptionId: purchase.productId,
                            token: purchase.purchaseToken
                        }, function (err, response) {
                            if (err) {
                                error = err;
                            }
                            else {
                                if (parseInt(response.data.expiryTimeMillis) > Date.now()) {
                                    reply({ status: "success", isValid: true });
                                    error = null;
                                }
                                else {
                                    error = "Unfortunately your subscription has expired";
                                }
                            }
                        })
                    });
                }

            });
            user.userSubscriptionType = "basic";

            user.save(function (err) {
                if (err) {
                    Logger.logErrorAndWarning(loggedInUserId, err);
                    reply({ status: "failure" });
                } else {
                }
            });

        }
    });
};
