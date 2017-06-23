/**
 * Created by Think on 2016/11/30.
 */
var util = require('util');
var Promise = require('promise');
//微信用户登录
module.exports.wxUserLogin = function(req, openid){
    req.session.openuser = openid;
};
//微信用户是否登录
module.exports.isWxUserLogin = function(req) {
    return util.isNullOrUndefined(req.session.openuser) === false;
};
//获取登录的微信用户的openid
module.exports.getWxUserOpenid = function(req) {
    return req.session.openuser;
};
//判断微信用户是否关注，该接口返回的是Promise对象，调用者请注意
module.exports.isWxUserSubscribe = function(req) {
//访问本地数据库，查找该用户是否在关注者列表中
    return Promise.resolve(false);
};
//设置该session的验证码
module.exports.setVerificationCode = function(req, code) {
    return req.session.verificationCode = code;
};
//
module.exports.checkVerificationCode = function(req, code) {
    return req.session.verificationCode == code;
};
//获取该session的验证码
module.exports.getVerificationCode = function(req) {
    return req.session.verificationCode;
};
