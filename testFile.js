const fs = require('fs');
var res = [];
//test file stream
var readStream = fs.createReadStream('dataminer.csv');

readStream.on('open', (data) => {
  console.log("open");
  console.log(data);
  readStream.pipe(res);
})

readStream.on('error', (err) => {
  console.log(res.err);
})

