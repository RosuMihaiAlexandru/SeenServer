const Venues = require("../models/Venues");

module.exports = function(request, reply) {
  var latitude = parseFloat(request.params.lat);
  var longitude = parseFloat(request.params.long);
  var page = parseInt(request.params.page);
  var isGoldMember = request.params.isGoldMember;
  var filterTag = request.params.filterTag;
  var searchKeyword = request.params.searchKeyword;
  var maxDistance = isGoldMember ? 50000 : 10000;

  if (
    (filterTag !== "" && filterTag !== undefined) ||
    (searchKeyword !== "" && searchKeyword !== undefined)
  ) {
    var filterTagSynonym = undefined;
    if (filterTag !== "" && filterTag !== undefined) {
      var filterTagSynonyms = require("../constants/tagSynonyms");
      filterTagSynonym = filterTagSynonyms.find(obj => {
        return obj.tag === filterTag;
      });
    }

    var searchRegExp = undefined;
    if (searchKeyword !== "" && searchKeyword !== undefined) {
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
        if (venues.length > 10) {
          venues.pop();
          hasNext = true;
        }

        reply({ data: venues, hasNext: hasNext });
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
        if (venues.length > 10) {
          venues.pop();
          hasNext = true;
        }

        reply({ data: venues, hasNext: hasNext });
      }
    );
  }
};

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
