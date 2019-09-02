const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//write CSV
const csvWriter = createCsvWriter({
    path: './output/output.csv',
    header: [{
            id: 'OriginalLoc',
            title: 'Original Location'
        },
        {
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
            id: 'lng',
            title: 'lng'
        },
        {
            id: 'distance',
            title: 'distance'
        }
    ]
});

module.exports = csvWriter;