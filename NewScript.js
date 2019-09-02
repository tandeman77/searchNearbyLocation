const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const request = require('request');


//write CSV
const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [{
    id: 'suburb',
    title: 'suburb'
  },
  {
    id: 'state',
    title: 'state'
  },
  {
    id: 'country',
    title: 'country'
  },
  {
    id: 'lat',
    title: 'lat'
  },
  {
    id: 'long',
    title: 'long'
  },
  {
    id: 'distance',
    title: 'distance'
  }
  ]
});

//reading CSV



function setApi(data) {
  var api = 'http://api.geonames.org/findNearbyPlaceNameJSON?lat=THE_LAT&lng=THE_LONG&radius=THE_RADIUS&username=tanatnous';
  console.log("setApi");
  return new Promise((resolve, reject) => {
    if(err){
      reject(err);
    } else {
      resolve(api.replace("THE_LAT", data.Lat)
        .replace("THE_LONG", data.Long)
        .replace("THE_RADIUS", data.radius_default));
    }
  });
}

function recordResult(outputArray, data) {
  outputArray.push({
    suburb: data.geonames[i].toponymName,
    state: data.geonames[i].adminName1,
    country: data.geonames[i].countryName,
    lat: data.geonames[i].lat,
    long: data.geonames[i].lng,
    distance: data.geonames[i].distance
  });
  console.log("${data} recorded");
}

// getRequestResults();
function initialise(url) {
  var options = {
    url: url
  };
  return new Promise(function (resolve, reject) {
    //request infomation from api
    request.get(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      };
    });
  });
};

function pushPromise(requestUrl, promises) {
  console.log("pushPromises");
  for (var i = 0; i < requestUrl.length; i++) {
    promises.push(initialise(requestUrl[i]));
    console.log("pushing promise number ${i + 1}")
  }
  return promises
}


async function read(name) {
  console.log("in read");
  var requestUrl = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(name, err)
      .pipe(csv())
      .on('data', (row) => {
        // THIS IS THE CODE
        requestUrl.push(setApi(row))
      })
      .on('end', () => {
        // The end of reading file
        console.log('CSV file successfully processed');
        console.log(requestUrl);
        resolve(requestUrl);
      }).on('error', (err) => {
        reject(row.err);
      })
  });
}

async function readFile() {
  var api = 'http://api.geonames.org/findNearbyPlaceNameJSON?lat=THE_LAT&lng=THE_LONG&radius=THE_RADIUS&username=tanatnous';
  var inputFile = 'dataminer.csv';
  console.log("in readFile");
  var requestUrl = await read(inputFile);
  console.log("out of read");
  var promises = [];

  console.log("past createReadStream");
  promises = await pushPromise(requestUrl, promises);
  return promises
}


async function getResultReady(callback) {
  var promises = await readFile();
  console.log("past readfile and pushpromises")
  return promises
};


async function main() {
  var output = [];
  var response = '';
  console.log("start read file")
  var promises = await getResultReady(initialise);
  console.log("finish readFile")
  Promise.all(promises).then(function (result) {
    for (var j = 0; j < promises.length; j++) {
      console.log(result[j]);
    }
  })
  // //temp
  // initialisePromise = initialise(api);
  // Promise.all(initialisePromise).then(function(response){
  //     // console.log(response);
  //     for (var j in initialisePromise){
  //         for (var i in response.geonames) {
  //             recordResult(output, response);
  //         };
  //     }
  // }, function(err){
  //     console.log(err);
  // })
};

main();

/*
read file to get lat and long
replace API

request and get information

write the info back

*/