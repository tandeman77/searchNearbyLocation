const csv = require('csv-parser'); 
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const request = require('request');
const setApi = require('./ApiSetting.js');

//write CSV
const csvWriter = createCsvWriter({
    path: './output/output.csv',
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


function read(file){
    var data = [];
    return new Promise ((resolve, reject) => {
        fs.createReadStream(file).pipe(csv()).on('data', (row) => {
            console.log(row);
            data.push(row);
        }).on('end', () => {
            resolve(data);
        })
    })

}

// function setApi(data) {
//     console.log("setApi");
//     var api = 'http://api.geonames.org/findNearbyPlaceNameJSON?lat=THE_LAT&lng=THE_LONG&radius=THE_RADIUS&username=USERNAME';
//     var usernames = [
//         'tanatnous6',
//         'tanatnous1',
//         'tanatnous2',
//         'tanatnous3',
//         'tanatnous4',
//         'tanatnous5',
//         'tanatnous',
//         'tanatnous7',
//         'tanatnous8',
//         'tanatnous9'
//     ]
//     var requestUrls = [];
//     return new Promise ((resolve, reject) => {
//         for (var i = 0; i < data.length; i++) {
//             requestUrls.push(api.replace("THE_LAT", data[i].Lat)
//                 .replace("THE_LONG", data[i].Long)
//                 .replace("THE_RADIUS", data[i].radius_default)
//                 .replace("USERNAME", usernames[Math.floor(Math.random() * 10) +1]));
//         }
//         console.log("end of set API")
//         resolve(requestUrls);
//     })
// }

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

function extractInfo(data) {
    return {
        suburb: data.toponymName,
        state: data.adminName1,
        country: data.countryName,
        lat: data.lat,
        long: data.lng,
        distance: data.distance
    };
}

async function main(){
    var output = [];
    var response = '';

    console.log("start read file")
    var fileName = './input/input.csv';
    var requestUrls = await read(fileName);
    console.log("done")
    console.log(requestUrls[0])

    console.log("start setting API");
    requestUrls = await setApi(requestUrls);
    console.log("out of setApi");
    console.log(requestUrls);

    var resultPromises = [];
    console.log("starting promises push");
    for (var i = 0; i < requestUrls.length; i++){
        resultPromises.push(initialise(requestUrls[i]));
        console.log("result promise" + i)
    }
    console.log("out of promises push");
    console.log("starting extracting info");

    var collection = [];
    await Promise.all(resultPromises).then((data) => {
        console.log("start looping through each result")
        console.log(data)
        for (i = 0; i< data.length; i++){
            for (var j = 0; j < data[i].geonames.length; j++){
                output.push(extractInfo(data[i].geonames[j]));
            }
        }
    })

    console.log(output);
    console.log(output.length + " locations detected");

    console.log("starting writing result")
    csvWriter.writeRecords(output).then(() => {
        console.log("write file done")
    })
    console.log("complete all");


};

main();
