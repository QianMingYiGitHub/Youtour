/**
 * Created by Think on 2016/11/30.
 */
var Promise = require('promise');
/**
 * 表结构：
 * openid: String, 
 * nickname:String, 
 * sex:Number,
 * city:String,
 * country:String,
 * province:String,
 * language:String,
 * headimgurl:String,
 * subscribe_time:DATE,
 * remark:String,
 * tagid_list:String
 */

module.exports.createUser = function(user) {
    return new Promise(function(resolve ,reject) {
        return resolve();
    })
}

module.exports.getUser = function(openid) {
    return new Promise(function(resolve ,reject) {
        return resolve();
    })
}

module.exports.updateUser = function(user) {
    return new Promise(function(resolve ,reject) {
        return resolve();
    })
}

moduel.exports.removeUser = function(openid) {
    return new Promise(function(resolve ,reject) {
        return resolve();
    })
}