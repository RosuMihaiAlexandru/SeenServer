'use strict';

const mongoose = require('mongoose');
const databaseConfig = require ('../config');

const database = mongoose.connect(databaseConfig.databaseUri, { dbName: 'SeenDatabase',  useNewUrlParser: true });

// database.on('error', (error) => {
//     throw error;
// });

// database.once('open', () => {
//     console.log('Connection with database succeeded.');
// });


module.exports = database;