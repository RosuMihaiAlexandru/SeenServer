'use strict';
const hapiAuthJwt2 = require('hapi-auth-jwt2');
const routes = require('./routes/routes');
const database = require('./db/database');
const cfg = require('./config');
const User = require('./models/User');
const createMessage = require('./handlers/createMessage');
const chatWithNotification = require('./handlers/notifications/chatWithNotifications');
const removeFromUnreadConversations = require('./handlers/removeFromUnreadConversations');
const uploadChatMedia = require("./handlers/uploadChatMedia");

const Hapi=require('hapi');

// Create a server with a host and port
const server=new Hapi.Server();
server.connection(cfg.server);

const sockets = {};
const socketIo = require('socket.io')(server.listener, {
    pingInterval: 15000,
    pingTimeout: 10000,
    cookie: false
});

socketIo.on('connection', (socket) => {
    socket.on('init', (userId) => {
        sockets[userId.senderSocketId] = socket;
        removeFromUnreadConversations(userId.senderId, userId.receiverId).then(
            (result) => {
                if (result) {
                    sockets[userId.senderSocketId].emit('unreadConversationCleared', '');
                }
            }
        );
    });
    
    socket.on("message", messageRequest => {
      messageRequest.receiverIsOnChat = false;
      if (messageRequest.message.msgType == "image") {
        uploadChatMedia(messageRequest.message.base64String, messageRequest.conversationId)
          .then( (result) => {
            messageRequest.message.mediaPath = result;
            if (sockets[messageRequest.receiverSocketId] && sockets[messageRequest.receiverSocketId].connected) {
              sockets[messageRequest.receiverSocketId].emit("message", messageRequest);
              messageRequest.receiverIsOnChat = true;
            }
            chatWithNotification(messageRequest).then(result => {
              messageRequest.message.status = "send_succeed";
              sockets[messageRequest.senderSocketId].emit("messageSent", messageRequest.message);
            });
          })
          .catch(err => {
            messageRequest.message.status = "send_failed";
            sockets[messageRequest.senderSocketId].emit("messageSent", messageRequest.message);
          });
      } else if (messageRequest.message.msgType == "text") {
        if (sockets[messageRequest.receiverSocketId] && sockets[messageRequest.receiverSocketId].connected) {
          sockets[messageRequest.receiverSocketId].emit("message", messageRequest);
          messageRequest.receiverIsOnChat = true;
        }
        chatWithNotification(messageRequest)
          .then(result => {
            messageRequest.message.status = "send_succeed";
            sockets[messageRequest.senderSocketId].emit("messageSent", messageRequest.message);
          })
          .catch(err => {
            messageRequest.message.status = "send_failed";
            sockets[messageRequest.senderSocketId].emit("messageSent", messageRequest.message);
          });
      }
    });

    socket.on('userDisconnected', (userId) => {
        delete sockets[userId.senderSocketId];
        socket.disconnect(true);
    });

    socket.on('disconnect', (reason) => {
        console.log(reason);
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