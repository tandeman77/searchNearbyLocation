const setApi = require('./ApiSetting.js');
const distance = require('./Distance.js');
const readFile = require('./ReadFile.js');
const writeFile = require('./WriteFile.js');
const requestFromApi = require('./request.js');

function processResultPromises(resultPromises, output,original) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < resultPromises.length; i++) {
            for (let j = 0; j < resultPromises[i].geonames.length; j++) {
                output.push(extractInfo(resultPromises[i].geonames[j], original));
                console.log(extractInfo(resultPromises[i].geonames[j]));
            }
        }
        resolve(output)
    }).catch((err) => {
        console.errors(err);
    })
}

function extractInfo(data, original) {
    return {
        suburb: data.toponymName,
        state: data.adminName1,
        country: data.countryName,
        lat: data.lat,
        lng: data.lng,
        distance: data.distance,
        original: original
    };
}

async function main() {
    let output = [];

    console.log("start read file")
    let inputFile = './input/input.csv';
    let requestUrls = await readFile(inputFile)
    .then(()=>{
        console.log('read input file done');
    })
    .catch((err) => {
        console.errors(err)
    });

    let cityDatabaseFile = './input/population.csv';
    let mainCities = await readFile(cityDatabaseFile)
    .then(()=>{
        console.log('city database loaded');
    })
    .catch((err) => {
        console.errors(err);
    });
    
    console.log(mainCities);

    console.log("start setting API");
    requestUrls = await setApi(requestUrls).catch((err) => {
        console.log(err)
    });
    console.log("out of setApi");

    let resultPromises = [];
    console.log("starting promises push");
    for (let i = 0; i < requestUrls.length; i++) {    
        requestPromise = await requestFromApi(requestUrls[i]).catch((err) => {
            console.log(err)
        });
        resultPromises.push(requestPromise);
        console.log("result promise" + i)
    }

    console.log("out of promises push");
    console.log("starting extracting info");
    
    console.log("start looping through each result")
    console.log(resultPromises)

    // extract results
    await processResultPromises(resultPromises, output);

    console.log("starting writing result")
    writeFile.writeRecords(output).then(() => {
        console.log("write file done")
    })
    console.log(output.length + " locations detected");
    console.log("complete all");
};

main();