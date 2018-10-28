'use strict';

const mongoose = require('mongoose');
mongoose.set('debug', true);

const databaseConfig = require ('../config');

const database = mongoose.connect(databaseConfig.databaseUri, { dbName: 'SeenDatabase',  useNewUrlParser: true, useCreateIndex: true  });

// database.on('error', (error) => {
//     throw error;
// });

// database.once('open', () => {
//     console.log('Connection with database succeeded.');
// });


module.exports = database;