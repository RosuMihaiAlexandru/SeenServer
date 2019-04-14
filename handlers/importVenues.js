const bcrypt = require("bcryptjs");
const Boom = require("boom");
const JWT = require("jsonwebtoken");
const Venues = require("../models/Venues");
const csv = require("csv-parser");
const fs = require("fs");
const image2base64 = require("image-to-base64");
const Logger = require("../helpers/Logger");

module.exports = async function(request, reply) {
    db.collection.remove()
    try {
        fs.createReadStream("bristolAll.csv")
    .pipe(csv())
    .on("data", row => {
        image2base64(row.Main_Image_URL) // you can also to use url
          .then(response => {
            console.log(response); //cGF0aC90by9maWxlLmpwZw==

            var imageBuffer = new Buffer(response, "base64");
            var userDirectory =
              "../../../mnt/seenblockstorage/venues/" + row.Plus_Code.replace(/\s/g, "");
            if (!fs.existsSync(userDirectory)) {
              fs.mkdirSync(userDirectory);
            }

            var fileName = getFormattedDate() + ".jpg";
            fs.writeFileSync(userDirectory + "/" + fileName, imageBuffer);
            let newVenue;
            return Venues.findOne({ name: row.Name }, function(err, venue) {
              if (!venue) {
                newVenue = new Venues({
                  location: {
                    type: "Point",
                    coordinates: [parseFloat(row.Lat), parseFloat(row.Lng)]
                  },
                  name: row.Name,
                  email: row.Email,
                  city: row.City,
                  state: row.State,
                  website: row.Website,
                  phone: row.Phone,
                  rating: row.Rating,
                  reviews: row.Reviews,
                  locationType: row.Category,
                  tag: [row.Category],
                  city: row.City,
                  address: row.Full_Address,
                  uniqueCode: row.Plus_Code,
                  photos: [
                    {
                      contentType: "image/jpg",
                      media:
                        "http://167.99.200.101/seenblockstorage/venues/" +
                        row.Plus_Code.replace(/\s/g, "") +
                        "/" +
                        fileName
                    }
                  ]
                });

                newVenue.save(err => {
                  if (!err) {
                  } else {
                    Logger.logErrorAndWarning(err);
                    reply({ status: "failure" });
                  }
                });
              } else if (venue) {
                reply(Boom.conflict("Venue already exists"));
              }
            });
          });
    })
    .on("end", () => {
        reply({ status: "success" });
    });
    } catch (error) {
        reply(error);
    }
  
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
