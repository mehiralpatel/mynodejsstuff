var con = require('../config')

var Users = function() {};


Users.prototype.isExist = function(req, res) {
    var id = req;
    var result = con.query("SELECT id,token_id FROM user_tokens WHERE mym_user_id=?", [id], function(err, result, fields) {
        if (err) {
            return res(false);
        } else {
            if (result != "") {
                return res(result);
            } else {
                return res(false);
            }
        }
    });
};

Users.prototype.getUserId = function(req, res) {
    var id = req;
    var result = con.query("SELECT user_id  FROM user WHERE lu_id=?", [id], function(err, result, fields) {
        if (err) {
            return res(false);
        } else {
            if (result != "") {
                return res(result);
            } else {
                return res(false);
            }
        }
    });
};

Users.prototype.getTokenId = function(req, res) {
    var id = req;
    var result = con.query("SELECT token_id  FROM user_tokens WHERE lu_id=?", [id], function(err, result, fields) {
        if (err) {
            return res(false);
        } else {
            if (result != "") {
                return res(result);
            } else {
                return res(false);
            }
        }
    });
};

Users.prototype.updateToken = function(req, res) {
    con.query("UPDATE user_tokens SET token_id = ?,first_name=?,last_name=? WHERE id = ?", [req.token_id, req.first_name, req.last_name, req.id], function(err, result, fields) {
        if (err) {
            return res(err);
        } else {
            return res(result);
        }
    });
};


Users.prototype.getUserIdFromToken = function(req, res) {
    con.query("SELECT userid FROM user_tokens WHERE token_id = ? ", [req.token_id], function(err, result, fields) {
        if (err) {
            return res(err);
        } else {
            if (result != "") {
            return res(result[0].userid);
        }
        else
        {
            //no user found
            return res(null);
        }
    }
    });
};


Users.prototype.checkUserId = function(req, res) {
    con.query("SELECT userid FROM user_tokens WHERE token_id = ? ", [req.token_id], function(err, result, fields) {
        if (err) {
            return res(err);
        } else {
            return res(result);
        }
    });
};

Users.prototype.checkToken = function(req, res) {
    con.query("SELECT token_id FROM user_tokens WHERE token_id = ? AND id = ?", [req.token_id, req.id], function(err, result, fields) {
        if (err) {
            return res(err);
        } else {
            return res(result);
        }
    });
};

Users.prototype.insert = function(req, res) {

    con.query("INSERT INTO user_tokens SET ?", [req], function(err, result, fields) {
        if (err) {
            return res(err);
        } else {
            if (result != "") {
                return res(result);
            } else {
                return res(result);
            }
        }
    });
}
module.exports = new Users();