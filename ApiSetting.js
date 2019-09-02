

function setApi(data) {
  const keys = require('./config/keys.json');
  //take in json object as input
  console.log("setApi");
  console.log(keys.apiurl);
  var api = keys.apiurl;
  var usernames = keys.apikeys;
  var keysCount = usernames.length;

  var requestUrls = [];
  return new Promise((resolve, reject) => {
    for (var i = 0; i < data.length; i++) {
      requestUrls.push(api.replace("THE_LAT", data[i].Lat)
        .replace("THE_LONG", data[i].Lng)
        .replace("THE_RADIUS", data[i].radius_default)
        .replace("USERNAME", usernames[Math.floor(Math.random() * keysCount)]));
    }
    console.log("end of set API")
    resolve(requestUrls);
  })
}

module.exports = setApi;