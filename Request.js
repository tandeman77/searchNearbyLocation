const request = require('request');

// getRequestResults();
function initialise(url) {
    let options = {
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

module.exports = initialise;