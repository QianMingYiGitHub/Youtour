
var Promise = require('promise');
var database = require('./dbutil/database');
var user_m = require('./model/user_m');
var phones_m = require('./model/phones_m');
var classes_m = require('./model/classes_m');
var questions_c = require('./controller/questions_c');
var phone = require('./model/phones_m');
var database = require('./dbutil/database');
module.exports.start = function() {
    return new Promise(function(resolve, reject) {
        //测试用

       return resolve();
    });
}


