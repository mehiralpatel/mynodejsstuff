
var sanitizer = require('../node_modules/sanitizer');
var util = require('../utils/response');
var message = require('../utils/messages.json');
var client = require('../utils/client');
var customers = require('../models/CustomerModel');
var _ = require("lodash");
var common = require("../utils/common");
var HttpStatus = require('http-status-codes');
var users = require('../models/userModel');
var Enums = require('../utils/enum');
const joi = require('../node_modules/joi');

exports.createCustomer= function(req, res, next) {
    
    //Validation Begin
    const orders = joi.object({
        product_id : joi.number().integer().required(),
        quantity : joi.number().integer().required().min(0).max(9999)

    });

    const customer  = joi.object().keys({
            name : joi.string().required().min(1).max(50),
            address:joi.string().required().min(1).max(500),
            orders : joi.array().items(orders)
        }
    );

    joi.validate({ 
        
        name: sanitizer.sanitize(req.body.name), 
        address : sanitizer.sanitize(req.body.address),
        orders : req.body.orders

    }, customer, 
    function (err, value) {
        console.log('test');
        if(err)
        {
            //if validation fails return error without processing further
            res.send(util.error(err, err.message));

        }

else{
    
        users.getUserIdFromToken(common.getToken(req), function(result) {
            if (result.code) {
                console.log("code error");
                return res.send(401);
            } else {
                if (result != "") {
                    loggedin_user_id = result;
                    console.log("result avail");
              

        //var reporting_fields = req.body.reporting_fields;
       var customer = { status: Enums.EnumStatus.Active.value , createdby: loggedin_user_id, lastmodifiedby: loggedin_user_id, lastmodifiedon: common.getDateTimeFormat(), createdon: common.getDateTimeFormat(), name: value.name, address: value.address};
        var post = { customer : customer, orders : value.orders  };
        customers.insertCustomer(post, function(result) {
            if (result.code) {
                res.send(util.error(result, message.common_messages_error));
            } else {
                if (result.affectedRows > 0) {
                    res.send(util.success(result, message.records_inserted));
                } else {
                    res.send(util.error(result, message.common_messages_error));
                }
            }
        });
    }
}}
);
}
});  // err === null -> valid
    // } else {
    //     res.send(util.error("", message.required_parameters_null_or_missing));
    // }

    return next();
};


// exports.insertCustomer = function(req, res, next) {
//     if (req.body != "" && req.body != undefined) {
//         var name = sanitizer.sanitize(req.body.name);
//         var address = sanitizer.sanitize(req.body.address);
        
//         var id = sanitizer.sanitize(req.params.id);

//         var data = { name: name, description: description , id: id };

//         customers.insertCustomer(data, function(result) {
//             if (result.code) {
//                 res.send(util.error(result, message.common_messages_error));
//             } else {
//                 if (result.affectedRows > 0) {
//                     var data_response = { result: result, updateId: id }
//                     res.send(util.success(data_response, message.records_updated));
//                 } else {
//                     res.send(util.error(result, message.common_messages_error));
//                 }
//             }
//         });
//     } else {
//         res.send(util.error("", message.required_parameters_null_or_missing));
//     }
//     return next();
// };


exports.getAllCustomer= function(req, res, next) {

    //parse page,search,filters;
    var request_params = common.parseListRequest(req);

    customers.getAllCustomers(request_params, function(result) {
        if (result.code) {
            res.send(util.errorResponse(result, message.common_messages_error));
        } else {
            if (result != "") {
                res.send(util.successResponse(result, message.common_messages_record_available,HttpStatus.OK));
            } else {
                res.send(util.successResponse("", message.common_messages_record_not_available,HttpStatus.OK));
            }
        }
    });
    return next();
};


exports.getCustomerDetails =  function(req, res, next) {
    try{
    var id = sanitizer.sanitize(req.params.id);
    if (id > 0) {
        customers.getCustomerDetails(id, function(result) {
            if (result.code) {
                res.send(util.error(result, message.common_messages_error));
            } else {
                if (result != "") {
                    res.send(util.success(result, message.common_messages_single_record_available));
                } else {
                    res.send(util.error(result, message.common_messages_single_record_not_available));
                }
            }
        });
    } else {
        res.send(util.error("", message.required_parameters_null_or_missing));
    }
    }
    catch(err)
    {
        res.send(util.error("",res.message));

    }
    return next();
};

exports.deleteCustomer =  function(req, res, next) {
    var id = sanitizer.sanitize(req.params.id);
    if (id > 0) {
        customers.deleteCustomer(id, function(result) {
            if (result.code) {
                res.send(util.error(result, message.common_messages_error));
            } else {
                //if (result != "") {
                if (result.affectedRows > 0) {
                    var data_response = { result: result, deletedId: id }
                    res.send(util.success(data_response, message.records_deleted));
                } else {
                    res.send(util.error(result, message.common_messages_record_not_available));
                }
            }
        });
    } else {
        res.send(util.error("", message.required_parameters_null_or_missing));
    }
    return next();
};
