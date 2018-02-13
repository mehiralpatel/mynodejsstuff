var sanitizer = require('../node_modules/sanitizer');

exports.getToken = function(req){
    req.token_id  = req.headers['authorization-token'];
    return req;
}
exports.getDateTimeFormat = function()
{
    return new Date();
//TODO UTC / or any format
}

exports.getDateFormat = function()
{
    return new Date();
//TODO UTC / or any format
}

exports.bulkInsert = function(connection, table, objectArray, callback) {
    let keys = Object.keys(objectArray[0]);
    let values = objectArray.map( obj => keys.map( key => obj[key]));
    let sql = 'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ?';
    connection.query(sql, [values], function (error, results, fields) {
      if (error) callback(error);
      callback(null, results);
    });
  }
  


exports.parseListRequest = function(req){

var query = req.query;
var page = sanitizer.sanitize(query.page);
if (page == undefined || page == "" || page < 0) {
    page = 0;
}
var limit = sanitizer.sanitize(query.page_size);
if (limit == undefined || limit == "" || limit < 0) {
    limit = 10;
}
var offset = page;
if (offset == undefined || offset == "" || offset < 0) {
    offset = 0;
}
var sort_by = sanitizer.sanitize(query.sort_by);
if (sort_by == undefined || sort_by == "") {
    sort_by = 'asc';
}

var sort_col = sanitizer.sanitize(query.sort_col);
if (sort_col == undefined || sort_col == "") {
    sort_col = 'name';
}

var search_text = sanitizer.sanitize(query.search_text);
if(search_text == undefined || search_text == "")
{
    search_text = ""; //clear search text
}
else{
    search_text = search_text + "%";
}

if (page >= 1) {
    offset = (page * limit) - limit;
}

var status = sanitizer.sanitize(query.status);
if (status == undefined || status == "") {
    status = 1;
}

var request_params = {
    sort_by: sort_by,
    sort_col: sort_col,
    limit: parseInt(limit),
    offset: parseInt(offset),
    status: parseInt(status),
    search_text : search_text,
    page: page
}
return request_params;
}