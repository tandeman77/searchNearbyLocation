const geolib = require('geolib');

function prepareLoc(data){
  return {
    lat: data.lat,
    lng: data.lng
  }
}

function Distance(original, destination){
  let ori = prepareLoc(original);
  let des = prepareLoc(destination);
  return geolib.getDistance(ori, des);
}

module.exports = Distance;