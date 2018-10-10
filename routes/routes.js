const membersChatRoutes = require('./membersChat.routes');
const usersRoutes = require('./user.routes');
const venuesRoutes = require('./venues.routes');

const routes = [].concat(membersChatRoutes, usersRoutes, venuesRoutes);

module.exports = routes;