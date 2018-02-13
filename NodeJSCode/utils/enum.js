var Enum = require('../node_modules/enum');
require('enum').register();

var EnumStatus = new Enum({'Active': 1, 'InActive':2 , 'Deleted': 3});
var EnumChargeType = new Enum ({'Fixed' :1 , 'Hourly': 2});
var EnumFrequency = new Enum ({'Daily' :1 , 'Weekly': 2,'Fortnightly': 3,'Montly':4,'Quarterly':5,'Annually':6});
var EnumDataType = new Enum({'textbox':1 },{'date':2});

exports.EnumStatus = EnumStatus;

exports.getStatus = function(req){
return EnumStatus.get(req);
}


exports.getDefaultChargeType = function(req)
{
    if(req)
        return EnumChargeType.get(req);
    else
        return null; 
        
}

exports.getDefaultFrequencyType = function(req)
{
    if(req)
        return EnumFrequency.get(req);
    else
        return null; 
        
}


exports.getDataType = function(req)
{
    if(req)
        return EnumDataType.get(req);
    else
        return null; 
        
}

// module.exports = {
// EnumStatus,



// }