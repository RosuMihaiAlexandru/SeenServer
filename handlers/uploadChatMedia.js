const fs = require("fs");

module.exports = async function (base64PhotoString, conversationId) {
  var ok = true;
  try {
    var imageBuffer = new Buffer(base64PhotoString, "base64");
    var conversationDirectory = "../../../mnt/seenblockstorage/" + conversationId;
    if (!fs.existsSync(conversationDirectory)) {
      await fs.mkdir(conversationDirectory);
    }
    var fileName = getFormattedDate() + ".jpg";
    await fs.writeFile(conversationDirectory + "/" + fileName, imageBuffer);
  } catch (err) {
    ok = false;
  }
  return new Promise((resolve, reject) => {
    ok ? resolve(
      "http://167.99.200.101/seenblockstorage/" +
      conversationId +
      "/" +
      fileName
    ) : reject('Error uploading image (uploadChatMedia.js)')
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
