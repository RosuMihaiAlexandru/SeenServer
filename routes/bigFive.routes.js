// routes.js
const handlers = require("../handlers/modules");

module.exports = [
  {
    //get all the questions and data required for the big five personality test
    method: "GET",
    path: "/getBigFiveData",
    handler: handlers.getBigFiveData,
    config: {
      auth: false
    }
  }
];
