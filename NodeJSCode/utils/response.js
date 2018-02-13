var log = require('../utils/logger');
var HttpStatus = require('http-status-codes');

var Util = function () {};

Util.prototype.success = function (payload, message) 
{

    log.info("res: " + JSON.stringify( payload))
    return {success: true, message: message, result: payload}

}
Util.prototype.error = function (payload, message) 
{
    log.error("err: " + payload)
    return {success: false, message: message, result: {}}

}

Util.prototype.successResponse = function (payload, message,code) 
{

    log.info("res: " + JSON.stringify( payload))
    return {code:code, success: true, message: message, data: payload}

}
Util.prototype.errorResponse = function (response, message) 
{
    //TODO: Need to extend as per resposne error no
    log.error("err: " + response.message)
    return {code:  HttpStatus.INTERNAL_SERVER_ERROR , success: false, message: response.code, result: {}}

}

module.exports = new Util();