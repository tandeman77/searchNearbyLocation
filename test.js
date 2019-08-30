const api = require('./config/keys.json');
const say = require('./ApiSetting.js');


console.log(api.apikeys[0])
say.say(api.apiurl);
say.sayUpper(api.apiurl);
