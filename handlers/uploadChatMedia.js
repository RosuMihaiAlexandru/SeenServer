const fs = require("fs");

module.exports = (base64PhotoString, conversationId) => {
    var imageBuffer = new Buffer(base64PhotoString, "base64");
    var conversationDirectory = "../../../mnt/seenblockstorage/" + conversationId;
    if (!fs.existsSync(conversationDirectory)) {
      fs.mkdirSync(conversationDirectory);
    }
    var fileName = getFormattedDate() + ".jpg";
    return fs
      .writeFileSync(conversationDirectory + "/" + fileName, imageBuffer)
      .then((result) => {
        return ({ path: "http://167.99.200.101/seenblockstorage/" + conversationId + "/" + fileName });
      });
};

function getFormattedDate() {
  var date = new Date();
  var nowDate =
    date.getFullYear() +
    "" +
    (date.getMonth() + 1) +
    date.getDate() +
    date.getHours() +
    date.getMinutes() +
    date.getSeconds();
  return nowDate;
}
