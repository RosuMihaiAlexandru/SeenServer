
const SettingsAndPreferences = require("../models/SettingsAndPreferences");

module.exports = async function(request, reply) {
  var loggedInUserId = request.params.loggedInUserId.toString();

  return SettingsAndPreferences.findOne({ memberId: { loggedInUserId } }).then(
    settingsAndPreferences => {
      if (settingsAndPreferences) {
        reply({
          settingsAndPreferences: settingsAndPreferences,
          status: "Success"
        });
      } else {
        reply({
          status: "NotFound"
        });
      }
    }
  );
};
