var restify = require('restify');
//var session = require('restify-session');
/*var session = require('restify-session')({
    debug: true,
    ttl: 2
});*/
var fs = require('fs');
var log = require('./utils/logger');
var message = require('./utils/messages.json');
var general_config = require('./utils/generalconfig.json');
var users = require('./models/UserModel');
var swagger = require('swagger-node-restify');
var validate = require('./node_modules/express-validation');
const joi = require('./node_modules/joi');
// creat server
const server = restify.createServer({
    name: 'customer',
    //version: '1.0.0',
    
    log: log
});

// attach the session manager
//server.use(session.sessionManager);

server.pre(function(request, response, next) {
    //console.log(request);
    request.log.info({ req: request }, 'start'); // (1)  
    return next();

});

swagger.setHeaders = function setHeaders(res) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");
    res.header("Content-Type", "application/json; charset=utf-8");
};
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //console.log(req.method);
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

// add middleware
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.use(function authenticate(req, res, next) {
    //console.log(req.url);
    // console.log(req.headers);
    var token_id = req.headers['authorization-token'];
    //var user_id = req.headers['user-id'];
    var device_type = req.headers['device-type'];
    var reqiest_url = req.url;
    var post = { token_id: token_id };
    //console.log(device_type);

    if (device_type != '' && device_type != undefined && token_id != '' && token_id != undefined) {

        if (device_type == general_config.android_token || device_type == general_config.web_token || device_type == general_config.iphone_token) {
            //console.log("in");
            if (token_id == 0 && user_id == 0 && reqiest_url == '/managed_users') {
                return next();
            } else {
                if (token_id != "") {

                    if (token_id == general_config.admin_access_key && device_type == general_config.web_token) {
                        return next();
                    } else {
                        users.checkUserId(post, function(result) {
                            if (result.code) {
                                console.log("code error");
                                res.send(401);
                            } else {
                                if (result != "") {
                                    console.log("result avail");
                                    return next();
                                } else {
                                    console.log("result not avail");
                                    res.send(401);
                                }
                            }
                        });
                    }
                } else {
                    res.send(401);
                }
            }
        } else {
            res.send(401);
        }

    } else {
        res.send(401);
    }
});

var controllers = {}
, controllers_path = process.cwd() + '/controllers'
fs.readdirSync(controllers_path).forEach(function (file) {
if (file.indexOf('.js') != -1) {
    controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
}
});

server.get({path: "/customers/:id" , version: "1.0.0"}, controllers.customers.getCustomerDetails);
server.get({path: "/customers", version: "1.0.0"}, controllers.customers.getAllCustomer);
server.post({path: "/customers", version: "1.0.0"},  controllers.customers.createCustomer);
//server.post({path: "/customers/:id", version: "1.0.0"}, controllers.customers.updateCustomer);
server.del({path: "/customers/:id", version: "1.0.0"}, controllers.customers.deleteCustomer);

var port = process.env.PORT || 1001;
// start server on specific port
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});