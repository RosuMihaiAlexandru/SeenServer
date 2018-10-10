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
    locationType: String,
    description: Date,
    tag: Array,
    street: String,
    postcode: String,
    location: {
        type: pointSchema,
        required: true
      },
    profileImages:[
        {
            contentType: String,
            media: String
        }
    ]
});

module.exports=mongoose.model('Venues', VenuesSchema,'Venues');