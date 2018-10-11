'use strict';

const routes = require('./routes/routes');
const database = require('./db/database');
const cfg=require('./config');

const Hapi=require('hapi');

// Create a server with a host and port
const server=new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });

// Connect with the database
server.app.db = database;


// Add the routes
server.route(routes);

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