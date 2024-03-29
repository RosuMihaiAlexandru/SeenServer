const Venues = require("../models/Venues");
const userSubscriptionTypes = require("../constants/userSubscriptionTypes");
const Logger = require("../helpers/Logger");

module.exports = function(request, reply) {
  var latitude = parseFloat(request.query.lat);
  var longitude = parseFloat(request.query.long);
  var page = parseInt(request.query.page);
  var isPremiumUser = request.query.userSubscriptionType === userSubscriptionTypes.gold || request.query.userSubscriptionType === userSubscriptionTypes.platinum;
  var filterTag = request.query.filterTag;
  var searchKeyword = request.query.searchKeyword;
  var maxDistance = isPremiumUser ? 50000 : 10000;


  try {
      
  if (filterTag !== "" || searchKeyword !== "") {
    var filterTagSynonym = undefined;
    if (filterTag !== "") {
      var filterTagSynonyms = require("../constants/tagSynonyms");
      filterTagSynonym = filterTagSynonyms.find(obj => {
        return obj.tag === filterTag;
      });
    }

    var searchRegExp = undefined;
    if (searchKeyword !== "") {
      searchRegExp = new RegExp(searchKeyword, "i");
    }

    var tagExpr = GetMatchExpressionForFilterOrSearchKeyword(
      searchRegExp,
      filterTagSynonym
    );

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
            spherical: true
          }
        },
        tagExpr,
        { $limit: page * 10 + 1 },
        { $skip: page * 10 - 10 }
      ],
      function(err, venues) {
        var hasNext = false;
        if (venues.length > 10) {
          venues.pop();
          hasNext = true;
        }

        if(!err){
          reply({ data: venues ? venues: [], hasNext: hasNext });
        }
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
            spherical: true
          }
        },
        { $limit: page * 10 + 1},
        { $skip: page * 10 - 10 }
      ],
      function(err, venues) {
        var hasNext = false;
        if (venues && venues.length > 10) {
          venues.pop();
          hasNext = true;
        }

        if(!err){
          reply({ data: venues ? venues: [], hasNext: hasNext });
        }
      }
    );
  }
  } catch (error) {
    reply({ data: [], hasNext: false });
  }
}
  

function GetMatchExpressionForFilterOrSearchKeyword(
  searchRegExp,
  filterTagSynonym
) {
  var tagExpr = undefined;
  if (searchRegExp == undefined && filterTagSynonym != undefined) {
    tagExpr = {
      $match: {
        locationType: { $in: filterTagSynonym.synonyms }
      }
    };
  }

  if (searchRegExp != undefined && filterTagSynonym == undefined) {
    tagExpr = {
      $match: {
        $and: [{ name: { $regex: searchRegExp } }]
      }
    };
  } else if (searchRegExp != undefined && filterTagSynonym != undefined) {
    tagExpr = {
      $match: {
        $and: [
          { locationType: { $in: filterTagSynonym.synonyms } },
          { name: { $regex: searchRegExp } }
        ]
      }
    };
  }
  return tagExpr;
}
