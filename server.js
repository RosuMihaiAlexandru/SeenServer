'use strict';
const hapiAuthJwt2 = require('hapi-auth-jwt2');
const routes = require('./routes/routes');
const database = require('./db/database');
const cfg = require('./config');
const User = require('./models/User');
const createMessage = require('./handlers/createMessage');
const chatWithNotification = require('./handlers/notifications/chatWithNotifications');
const removeFromUnreadConversations = require('./handlers/removeFromUnreadConversations');

const Hapi=require('hapi');

// Create a server with a host and port
const server=new Hapi.Server();
server.connection(cfg.server);

const sockets = {};
const socketIo = require('socket.io')(server.listener, {
    pingTimeout: 5000,
});

socketIo.on('connection', (socket) => {
    socket.on('init', (userId) => {
      sockets[userId.senderId] = socket;
      removeFromUnreadConversations(userId.senderId, userId.receiverId);
      if(sockets[userId.receiverId]){
        sockets[userId.receiverId].emit('userIsOnChat', '');
      }
    });
    
    socket.on('message', (messageRequest)=>  {
        if (sockets[messageRequest.receiverId]) {
          sockets[messageRequest.receiverId].emit('message', messageRequest);
        }
        chatWithNotification(messageRequest);
      });

    socket.on('userIsTyping', (users) =>{
        if(sockets[users.receiverId]){
            sockets[users.receiverId].emit('userIsTyping', '')
        }
    });  

    socket.on('userStoppedTyping',(users) =>{
        if(sockets[users.receiverId]){
            sockets[users.receiverId].emit('userStoppedTyping', '')
        }
    });    

    socket.on('disconnect', (userId) => {
        delete sockets[userId.senderId];
        if(sockets[userId.receiverId]){
            sockets[userId.receiverId].emit('userLeftChat', '');
        }
    });
});

//connect server with database
server.app.db = database;

const validate = (decoded, request, callback) => {
    User.findOne({ email: decoded.email }).then(
      (user) => {
        if (!user) {
          return callback(null, false);
        }
        return callback(null, true);
      },
    );
};

//register authentication mode for server
server.register(hapiAuthJwt2, (err) => {
    if (err) {
      console.log(err);
    }

    //we can define multiple authentication strategies if needed
    server.auth.strategy('jwt', 'jwt', {
        key: cfg.jwt.secret,
        validateFunc: validate,
        verifyOptions: {
          algorithms: ['HS256'],
        },
    });

    // Add the routes
    server.route(routes);

    server.auth.default('jwt');
});


// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();