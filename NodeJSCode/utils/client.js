var restify = require('../node_modules/restify-clients');
var client = restify.createJsonClient({
    url: 'http://mymapi.nodejsapi.com'
});

module.exports = client