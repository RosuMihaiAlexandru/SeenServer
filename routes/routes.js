const membersChatRoutes = require("./membersChat.routes");
const usersRoutes = require("./user.routes");
const venuesRoutes = require("./venues.routes");
const settingsAndPreferencesRoutes = require("./settingsAndPreferences.routes");

const routes = [].concat(
  membersChatRoutes,
  usersRoutes,
  venuesRoutes,
  settingsAndPreferencesRoutes
);

module.exports = routes;
