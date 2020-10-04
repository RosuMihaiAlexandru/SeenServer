const fs = require("fs");
const Logger = require("../helpers/Logger");
const User = require('../models/User');

module.exports = async function (request, reply) {
    const data = request.payload;
    try {
        if (data.file && data.email) {
            const email = data.email;
            User.findOne({ email: data.email }, async function (error, user) {
                if (error) {
                    Logger.logErrorAndWarning("", error);
                    return reply({error: "Server Error"})
                }

                if (user) {

                    const name = data.file.hapi.filename;
                    var userDirectory = "../../../mnt/seenblockstorage/" + email;
                    if (!fs.existsSync(userDirectory)) {
                        await fs.mkdir(userDirectory, (err) => {
                            if (err) {
                                Logger.logErrorAndWarning("", err);
                                return reply({error: "Server Error"})
                            }
                        });
                    }
                    const path = userDirectory + "/" + name;
                    const file = fs.createWriteStream(path);

                    file.on('error', (err) => {return reply({ error: err })});

                    data.file.pipe(file);
                    user.recordingIntro = "http://167.99.200.101/seenblockstorage/" + email + "/" + name;

                    data.file.on('end', (err) => {
                        user.save(function (err) {
                            if (err) {
                                Logger.logErrorAndWarning("", err);
                                return reply({ error: err });
                            }
                        });

                        return reply({ success: true });
                    });
                } else {
                    return reply({error: "User " + email + " not found"});
                }
            });
        }
    } catch (err) {
        Logger.logErrorAndWarning("", err);
        return reply({ error: "Server Error" });
    }
}