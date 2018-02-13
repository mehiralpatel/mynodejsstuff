var con = require('../config')
var LINQ = require("node-linq").LINQ;
var Enums = require('../utils/enum')
var common = require('../utils/common')
var users = require('./UserModel');

var CustomersModel = function() {};




CustomersModel.prototype.insertCustomer = function(req, res) {
/* Begin transaction */

con.beginTransaction(function(err) {
    if (err) { throw err; }

     con.query('INSERT INTO customer SET ?',[req.customer] , function(err, result) {
      if (err) { 
        con.rollback(function() {
          throw err;
        });
      }
   else{
      var inserted_id = result.insertId;
    if(req.orders.length > 0)
    {
      var orders = new LINQ(req.orders)
      .Select(function(r){
          return{
            productid : r.product_id,
            quatntiy : r.quatntiy,
            customerid : inserted_id
          };
      }).ToArray();


     common.bulkInsert(con, 'customerorders', orders, (error, response) => {
        if (err) { 
            con.rollback(function() {
            throw err;
          });
        }  
        con.commit(function(err) {
          if (err) { 
            con.rollback(function() {
              throw err;
            });
          }
          console.log('Customer order Complete.');
          return res(result);
       //   con.end();
        });
      });
    }
    else{
        return res(result);
    }
    }
    });
     
  });

 
   
}


CustomersModel.prototype.getAllCustomers = function(req, res) {
    var search = "";
        if( req.search_text ) {
         search = " and c.name like '" + req.search_text + "'";
        }
        
        con.query("SELECT c.customerid,c.name,c.address,c.status  from customer c where c.status=? " + search +  " ORDER BY  " +  req.sort_col + " "  + req.sort_by + "  LIMIT ? OFFSET ?", [ req.status, req.limit, req.offset], function(err, result, fields) {
            
        if (err) {
            return res(err);
        } 
        else {
         var customers = new LINQ(result)
            .Select(function(p){
                return{
                    id: p.customerid,
                    name : p.name,
                    status : p.status,
                    address : p.address,
                    statusString : Enums.getStatus(p.status)
                    //default_charge_type : Enums.getDefaultChargeType(p.default_charge_type_id),
                    
                    //default_charge_type_id : p.default_charge_type_id,
                    //is_default_seperately_charge : p.is_default_seperately_charge,
                    //allocation_preference_id : p.allocation_preference_id,
                    //allocation_prefernce : p.allocation_preference_name

                };
            }).ToArray();
 
            var recordsCount = result.length;
            con.query("select count(c.name) as count from customer c where c.status =? " + search,  [ req.status], function(err, result, fields) {
                if(err){
                    return res(err);
                }
                else{
                    return res({ total_count :result[0].count, page_start : parseInt(req.page), page_size :recordsCount , list: customers } );
                }
            });
        }
    });
};

CustomersModel.prototype.getCustomerDetails = function(req, res) {
    console.log(req);
    con.query("SELECT c.customerid, c.name,c.address,c.status from customer c where c.status=1 and c.customerid = ?", [req], function(err, result, fields) {
    
        if (err) {
            return res(err);
        } 
        else {
            if(result.length == 0)
            {
                return res(result);
            }
            else{
         var customer = new LINQ(result)
            .FirstOrDefault(function(p){
                return{
                    id: p.customerid,
                    name : p.name,
                    address : p.address,
                    status : p.status,
                    statusString : Enums.getStatus(p.status)
                };
            });
            
        con.query("select o.orderid, o.customerid , o.productid,p.name,p.price, (o.quantity*p.price) as totalprice from customerorders o inner join product p  where o.productid =  p.productid and o.customerid =?", [customer.customerid] , function(err, result, fields) {
            if(err){
                return res(err);
            }
            else{

                var orders = new LINQ(result)
                .Select(function(r){
                    return{
                       order_id : r.orderid,
                       customer_id : r.custormerid,
                       product_id : r.productid,
                       product_name : r.name,
                       total_price : r.totalprice
                    };
                }).ToArray();
 
                
        customer.orders = orders;
            return res( customer );
            }
            });
        };
    }

});
    }

    CustomersModel.prototype.deleteCustomer = function(req, res) {
    con.query("DELETE FROM customer where id=?", [req], function(err, result, fields) {
        if (err) {
            return res(err);
        } else {
            return res(result);
        }
    });
};



module.exports = new CustomersModel();