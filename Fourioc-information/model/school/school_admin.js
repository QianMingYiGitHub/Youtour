var Promise = require('promise');
var DB = require('../DB');
var util = require('util');

exports.setSchoolAdmin = function(userid) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('', 'school_admin').create({user:userid}, function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

exports.removeSchoolAdmin = function(userid) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('', 'school_admin').remove({user:userid}, function(err, result) {
            if(err) {
                return reject(err);
            }
            return resolve();
        });
    });
};