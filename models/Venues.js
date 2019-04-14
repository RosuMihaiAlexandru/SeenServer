const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    location: {
        type: {type: String},
        coordinates: []
      }
  });

    // define the index
    pointSchema.index({location: '2dsphere'});

const VenuesSchema=new mongoose.Schema({
    name: String,
    city: String,
    state: String,
    website: String,
    email: String,
    phone: String,
    rating: Number,
    reviews: String,
    locationType: String,
    tag: Array,
    address: String,
    uniqueCode : String,
    location: {
        type: {type: String},
        coordinates: []
      },
    photos:[
        {
            contentType: String,
            media: String
        }
    ]
});

    // define the index
    VenuesSchema.index({"location": '2dsphere'});
module.exports=mongoose.model('Venues', VenuesSchema,'Venues');