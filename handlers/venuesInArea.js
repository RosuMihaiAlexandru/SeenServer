
const Venues = require("../models/Venues");

module.exports = function(request, reply) {
  var latitude = parseFloat(request.params.lat);
  var longitude = parseFloat(request.params.long);
  var page = parseInt(request.params.page);
  var isGoldMember = request.params.isGoldMember;
  var filterTag = request.params.filterTag;
  var searchKeyword = request.params.searchKeyword;
  var maxDistance = isGoldMember ? 50000 : 10000;

  if (filterTag !== "") {
    var filterTagSynonyms = require("../constants/tagSynonyms");
    var filterTagSynonym = filterTagSynonyms.find(obj => {
      return obj.tag === filterTag;
    });

    var tagExpr = undefined;
    if (searchKeyword !== "") {
      var searchRegExp = new RegExp(searchKeyword, "i");
      tagExpr = {
        $match: {
          $and: [
            { name: { $regex: searchRegExp } }
          ]
        }
      };
    } else {
      tagExpr = {
        $match: {
          locationType: { $in: filterTagSynonym.synonyms }
        }
      };
    }

    Venues.aggregate(
      [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            distanceField: "dist",
            maxDistance: maxDistance,
            spherical: true,
            limit: 10000
          }
        },
        tagExpr,
        { $limit: page * 10 + 1 },
        { $skip: page * 10 - 10 }
      ],
      function(err, venues) {
        var hasNext = false;
        if(venues.length > 10){
          venues.pop();
          hasNext = true;
        }

        reply({ data: venues, hasNext: hasNext});
      }
    );
  } else {
    Venues.aggregate(
      [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            distanceField: "dist",
            maxDistance: maxDistance,
            spherical: true,
            limit: page * 10 + 1
          }
        },
        { $skip: page * 10 - 10 }
      ],
      function(err, venues) {
        var hasNext = false;
        if(venues.length > 10){
          venues.pop();
          hasNext = true;
        }

        reply({ data: venues, hasNext: hasNext});
      }
    );
  }
};
