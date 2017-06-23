var util = require('util');
var Promise = require('promise');
var DB = require('../DB');

exports.postMessage = function(corpId, appname, record_id, message) {
    return new Promise(function(resolve, reject) {
        DB.findOne(corpId, 'app_reply', {corpid:corpId, appname:appname, record_id}, function(err, result) {
            if(util.isNullOrUndefined(result)){
                DB.save(corpId, 'app_reply', {
                    corpid:corpId,
                    appname:appname,
                    record_id:record_id,
                    reply:[{
                        userid:message.userid,//发送消息人的openid
                        identity:message.identity,
                        ext:message.ext,
                        name:message.name,//发送消息人的名称
                        touser:message.touser||[],
                        message:message.message//消息里面包括@xxx,@xxx
                    }]
                }, function(err, product){
                    if(err){
                        return reject(err);
                    }
                    return resolve(product);
                });
            }else{
                result.reply.push({
                    userid:message.userid,//发送消息人的openid
                    identity:message.identity,
                    ext:message.ext,
                    name:message.name,//发送消息人的名称
                    touser:message.touser||[],
                    message:message.message//消息里面包括@xxx,@xxx
                });
                result.save(function(err){
                    if(err){
                        return reject(err);
                    }
                    return resolve(result);
                });
            }
        });
    });
};

exports.getMessage = function(corpId, appname, record_id){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'app_reply', {corpid:corpId, appname:appname, record_id:record_id}, function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

exports.deleteMessage = function(corpId, appname, record_id, messageId) {
    return new Promise(function(resolve, reject){
        DB.updateData(corpId, 'app_reply', {corpid:corpId, appname:appname, record_id:record_id}, {'$pull':{reply:{_id: messageId}}}, function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};