/**
 * Created by Think on 2016/8/30.
 */
var express = require('express');
var router = express.Router();
var oauth = require('../../service/wxoauth');
var crypto = require('../../api/crypto');
var subscriber = require('../../model/subscribers');
var request = require('request');
var logger = require('../../api/logger').logger;
var async = require('async');
var util = require('util');

// router.use(function(req, res, next){
//     auth.weixinUserCheck(req, res, next);
// });
var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateMixed(n) {
    var res = '';
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return res;
}

var subscriberAsyncQueue = async.queue(function(task, callback){
    if(util.isFunction(task.handler)){
        task.handler(callback);
    }else{
        callback(new Error('task.handler isnot function'));
    }
});

 
router.get('/mypep', oauth.oauth, function(req, res, next){
    console.log('req.session = ' + JSON.stringify(req.session));
    subscriberAsyncQueue.push({
        handler: function(callback){
            if (oauth.isOauthed(req)) {
                subscriber.findMypepSubscriberByCorpUser(req.session.corpId, req.session.userid).then(function (data) {
                    if(data && data.length){
                        // encryption(Math.round(Date.now()/1000) + "|3600|01234567|574bd2d6e98e4a4425f5cdc1|3","unE7ESqLFcp9JtZi");
                        var lntoken = crypto.aesEncryption(Math.round(Date.now()/1000) + '|3600|'+generateMixed(8)+'|'+data[0].syncUserReq.userInfoDTO.uid + '|' + data[0].syncUserReq.userInfoDTO.role,'unE7ESqLFcp9JtZi');
                        console.log('redirect_url = http://v.mypep.youtour.com.cn/?lntoken=' + lntoken);
                        res.redirect('http://v.mypep.youtour.com.cn/?lntoken='+lntoken);
                        callback();
                    }else{
                        var startTime = Date.now();
                        var endTime = startTime + 30*24*3600*1000;

                        return subscriber.createMypepSubscriber(req.session.corpId, req.session.userid, req.session.name, 2, startTime, endTime).then(function (data2) {
                            if(data2){
                                var lntoken = crypto.aesEncryption(Math.round(Date.now()/1000) + '|3600|'+generateMixed(8)+'|'+data2.syncUserReq.userInfoDTO.uid + '|' + data2.syncUserReq.userInfoDTO.role,'unE7ESqLFcp9JtZi');
                                res.redirect('http://v.mypep.youtour.com.cn/?lntoken='+lntoken);
                                callback();
                            }else{
                                return Promise.reject(new Error('您还没有订阅人教微课'));
                            }
                        });
                    }
                }).catch(function (err) {
                    callback(err);
                });
            } else {
                callback(new Error('无效用户'));
            }
        }
    }, function(err){
        if(err){
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI(err.message)));
        }
    });
});

router.post('/mypep/scan',function(req, res, next){
    subscriberAsyncQueue.push({
        handler: function(callback){
            if (oauth.isOauthed(req)) {
                var redirect_uri = decodeURIComponent(req.body.redirect_uri);
                var role = parseInt(req.body.role);
                
                subscriber.findMypepSubscriberByCorpUserAndRole(req.session.corpId, req.session.userid, role).then(function(data){
                    if(data){
                        return Promise.resolve(data.toJSON());
                    }else{
                        var startTime = Date.now();
                        var endTime = startTime + 30*24*3600*1000;

                        return subscriber.createMypepSubscriber(req.session.corpId, req.session.userid, req.session.name, role, startTime, endTime).then(function (data2) {
                            if(data2){
                                return Promise.resolve(data2.toJSON());

                            }else{
                                return Promise.reject(new Error('您还没有订阅人教微课'));
                            }
                        });
                    }
                }).then(function(data){
                    var lntoken = crypto.aesEncryption(Math.round(Date.now()/1000) + '|3600|'+generateMixed(8)+'|'+data.syncUserReq.userInfoDTO.uid + '|' + data.syncUserReq.userInfoDTO.role,'unE7ESqLFcp9JtZi');
                    request(
                        {
                            url:redirect_uri,
                            headers: {
                                'lntoken':lntoken
                            }
                        }, 
                        function(error, response, body){
                            if (!error && response.statusCode == 200) {
                                var match_result = body.match(/http:\/\/i.mypep.youtour.com.cn\/lnlt\/synclogin\/[a-zA-Z0-9]{16}/g);
                                if(match_result && match_result.length === 1){
                                    request.get(match_result[0],function (error, response, body){
                                        if (!error && response.statusCode == 200) {
                                            callback();
                                        }else{
                                            callback(new Error('登录失败'));
                                        }
                                    });
                                }else{
                                    callback(new Error('登录失败'));
                                }
                            }
                        }
                    );
                }).catch(function(err){
                    callback(err);
                });
            } else {
                callback(new Error('无效用户'));
            }
        }
    }, function(err){
        if(err){
            return res.json({
                success: -1,
                desc:err.message,
                data:{}
            });
        }else{
            return res.json({
                success: 0,
                desc:'success',
                data:{}
            });
        }
    });
});

router.get('/role', function(req, res, next){
    if (oauth.isOauthed(req)) {
        var role = [];
        if(req.session.role){
            role = req.session.role;
        }
        subscriber.findMypepSubscriberByCorpUser(req.session.corpId, req.session.userid).then(function(datas){
            datas.forEach(function(data){
                if(-1 === role.findIndex(function(elem){
                    return elem === data.syncUserReq.userInfoDTO.role;
                })){
                    role.push(data.syncUserReq.userInfoDTO.role);
                }
            });
        }).then(function(){
    //        logger.info("/subscriber/role.result = " + JSON.stringify(role));
            return res.json({
                success: 0,
                desc: 'success',
                data:{
                    role:role
                }
            });
        }).catch(function(err){
            return res.json({
                success: -1,
                desc: err.message,
                data:{
                    role:[]
                }
            });
        });
    } else {
        return res.json({
            success: -1,
            desc:'无效用户',
            data:{}
        });
    }
});

router.get('/exercise', oauth.oauth, function(req, res, next){
    return res.redirect('/ren_jiao_ce_ping/rjcp_scan_code.html'.concat('?corp_id=',req.session.wx.corpId,'&user_id=',req.session.wx.userid));
});

router.get('/exercise/login', oauth.oauth, function(req, res, next){
    console.log('req.query.redirect_uri=' + req.query.redirect_uri);
    return res.redirect('/ren_jiao_ce_ping/rjcp_use_pc.html'.concat('?redirect_uri=',encodeURIComponent(req.query.redirect_uri),'&role=',req.query.role));
});

router.get('/exercise/login/success', oauth.oauth, function(req, res, next){
    return res.redirect('/ren_jiao_ce_ping/rjcp_success.html');
});

router.get('/exercise/login/failure', oauth.oauth, function(req, res, next){
    return res.redirect('/ren_jiao_ce_ping/rjcp_failure.html');
});

module.exports = router;
