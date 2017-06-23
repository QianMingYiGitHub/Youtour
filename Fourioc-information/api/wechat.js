var util = require('util');
var config = require('./config');
var API = require('wechat-enterprise-api');
var wechat = require('wechat-enterprise');
var Promise = require('promise');
var fs = require('fs');
//const fs = require('fs');
/**
 * 一个企业号应该只有一个授权管理组
 */
var wechatMng = {};
var tokenContainer = {};
 
wrapper = function (callback) {
    return function (err, data, res) {
        callback = callback || function () {};
        if (err) {
            err.name = 'WeChatAPI' + err.name;
            return callback(err, data, res);
        }
        if (data.errcode) {
            err = new Error(data.errmsg);
            err.name = 'WeChatAPIError';
            err.code = data.errcode;
            return callback(err, data, res);
        }
        callback(null, data, res);
    };
};

/*!
 * 对提交参数一层封装，当POST JSON，并且结果也为JSON时使用
 */
postJSON = function (data) {
    return {
        dataType: 'json',
        type: 'POST',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    };
};
API.prototype.getLoginInfoByAuthCode = function (code, callback) {
    this.preRequest(this._getLoginInfoByAuthCode, arguments);
};

/*!
 * 获取成员的未封装版本
 */
API.prototype._getLoginInfoByAuthCode = function (code, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=ACCESS_TOKEN&code=CODE&agentid=AGENTID
    var url = this.prefix + 'service/get_login_info?access_token=' + this.token.accessToken;
    var data = {
        auth_code: code
    };
    this.request(url, postJSON(data), wrapper(callback));
};

var checkTokenValid = function(corp,secret){
    if(util.isNullOrUndefined(corp)){
        return false;
    }
    if(util.isNullOrUndefined(corp[secret])){
        return false;
    }
    if(util.isNullOrUndefined(corp[secret].expires_in)){
        return false;
    }
    var dif = corp[secret].expires_in - Date.now();
    if(dif >= 0)
        return true;
    return false;
};
function getCorpMananger(corpId,appid){
    if(util.isNullOrUndefined(appid)){
        appid = 0;
    }
    var wechatObj = wechatMng[corpId];
    console.log("初始文件:"+wechatObj);
    if(util.isNullOrUndefined(wechatObj)){
        return null;
    }
    if(util.isNullOrUndefined(wechatObj[appid])){
        var info = wechatObj.info;
        wechatObj[appid] = new API(info.corpId, info.secret, appid, function (callback) {
            fs.readFile(info.corpId+'access_token.txt', 'utf8', function (err, txt) {
                if (err) {
                    if(err.code === 'ENOENT'){
                        return callback(null,null);
                    }else{
                        return callback(err);
                    }
                }
                var secret = JSON.parse(txt);
                if(secret && (secret.expires_in > Date.now())){
                    callback(null, secret.access_token);
                }else{
                    callback(null,null);
                }
            });
        },function(token, callback) {
          // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
          // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
            var secret = {
                access_token :token,
                expires_in :(Date.now() + 7200*1000)
            };
            fs.writeFile(info.corpId+'access_token.txt', JSON.stringify(secret), callback);
        });
    }
    return wechatObj;
}
exports.getCorpManager = getCorpMananger;

function createCorpManager(info) {//这个什么时候调用
    //info={corpId:"wx89c411811fef7bc6",secret:"MvicjDUCKrn4rKOzSCH-vcjD1PPzKsG1zcDnsvE1V9NaaKi-2-IIxxifWyl78Cp1"};
    if(util.isNullOrUndefined(wechatMng[info.corpId])){
        //API应该是一个企业号一个，所有应用id没有用
        //此时的appid为啥是0 
        var api = new API(info.corpId, info.secret, 0, function (callback) {
            fs.readFile(info.corpId+'access_token.txt', 'utf8', function (err, txt) {
                if (err) {
                    if(err.code === 'ENOENT'){
                        return callback(null,null);
                    }else{
                        return callback(err);
                    }
                }
                var secret = JSON.parse(txt);
                if(secret && (secret.expires_in > Date.now())){
                    callback(null, secret.access_token);
                }else{
                    callback(null,null);
                }
            });
        },function(token, callback) {
            // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
            // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
            var secret = {
                access_token :token,
                expires_in :(Date.now() + 7190*1000)
            };
            fs.writeFile(info.corpId+'access_token.txt', JSON.stringify(secret), callback);
        });
        wechatMng[info.corpId] = {};
        console.log(1);
        //为什么错误$.parseJSON

        //console.log(info.parseJSON());
        //console.log(wechatMng[info.corpId]['info']);
        wechatMng[info.corpId]['info'] = info;
        console.log(2);
        wechatMng[info.corpId]['msg'] = wechat({token:config.getToken(),encodingAESKey:config.getEncodingAESKey(),corpId:info.corpId});
        wechatMng[info.corpId][0] = api;
        wechatMng[info.corpId].api = api;
    }
    return wechatMng[info.corpId];
};

exports.createCorpManager=createCorpManager;

exports.createWeixinUser = function(corpId, mobile, name){
    var corp = getCorpMananger(corpId);
    if(util.isNullOrUndefined(corp) === false) {
        return new Promise(function(resolve, reject){
            var user = {
                'userid': mobile,
                'name': name,
                'department': [1],
                'mobile': mobile
            };
            corp.api.createUser(user,function(err, result){
                if(err && err.code !== 60102){
                    return reject(err);
                }
                return resolve(result);
            });
        }).then(function(result){
            if(result.errcode !== 60102 && result.errcode !== 0){
                return Promise.reject(new Error(result.errmsg));
            }
            return Promise.resolve();
        });
    }else{
        return Promise.reject(new Error('no corp when create weixin user!'));
    }
};

exports.getWeixinUser = function(corpId, userid){
  //return Promise.resolve({userid:userid,name:"",department:[1],position:"",mobile:userid,status:1})
    var corp = getCorpMananger(corpId);
    if(util.isNullOrUndefined(corp) === false) {
        return new Promise(function(resolve, reject){
            corp.api.getUser(userid,function(err, result){
                if(err){
                    return reject(err);
                }
                if(result.errcode === 0){
                    delete result.errcode;
                    delete result.errmsg;
                    return resolve(result);
                }else{
                    return reject(new Error(result.errmsg));
                }
            });
        });
    }else{
        return Promise.reject(new Error('no corp when create weixin user!'));
    }
};
