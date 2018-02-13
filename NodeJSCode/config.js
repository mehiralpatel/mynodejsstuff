'use strict';
var mysql = require('mysql');
var config = mysql.createConnection({ host: "localhost", user: "root", password: "rootpassword", database: "sys" });




module.exports = config