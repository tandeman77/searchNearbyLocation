const fs = require('fs');
const csv = require('csv-parser');
function read(file) {
    var data = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(file).pipe(csv()).on('data', (row) => {
            data.push(row);
        }).on('end', () => {
            resolve(data);
        })
    })

}

module.exports = read;