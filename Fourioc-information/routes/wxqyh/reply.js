var util = require('util');
var express = require('express');
var router = express.Router();
var Promise = require('promise');
var logger = require('../../api/logger').logger;
var reply = require('../../model/school/app_reply');
var apptype = require('../../api/apptype');
var wechat = require('../../api/wechat');
//var corpLib = require('../../library/corp/index');
var MSG = require('../../api/msg.js');
var wxUser = require('../../model/contact/wxUser');
var config = require('../../api/config');

router.post('/activity/:id', function(req, res, next){
    var corpId = req.body.corpId||req.body.corpid;
    if(util.isNullOrUndefined(corpId)){
        return res.json({
            success: -1,
            desc:'no corp',
            data:{}
        });
    }
    reply.postMessage(corpId,'activity', req.params.id, req.body)
    .then(function(result){
        return corpLib.getAppid(corpId, apptype.getAppType('activity'))
        .then(function(appid){
            var api = wechat.getCorpManager(corpId, appid)[appid];
            if(util.isArray(req.body.touser)){
                var promises = req.body.touser.map(function(user){
                    var url = 'http://' + config.getURL() + '/activity/message_push?' + 'user_id=' + user.userid + '&activity_id=' + req.params.id + '&corp_id=' + corpId;
                    switch(parseInt(user.identity)){
                    case 1://家长
                        url += '&type=3&identity=1&sid='+user.ext;
                        break;
                    case 2://老师
                        url += '&type=3&identity=2';
                        break;
                    case 3://创建者
                        url += '&type=1&identity=3';
                        break;
                    }
                    var message = {
                        to:{
                            touser:user.userid
                        },
                        msg:{
                            msgtype:'news',
                            news:{
                                articles:[
                                    {
                                        title:'班级活动:' + req.body.name + '@了你',
                                        description:'有新评论啦：'+req.body.message,
                                        url:url
                                    }
                                ]
                            }
                        },
                        safe:'0'
                    };
                    return MSG.sendMessage(api, message);
                });
                return Promise.all(promises);
            }
        });
    })
    .then(function(){
        return res.json({
            success:0,
            desc:'success',
            data:{}
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc:err.message,
            data:{}
        });
    });
});

router.get('/activity/:id', function(req, res, next){
    var corpId = req.query.corpId||req.query.corpid;
    if(util.isNullOrUndefined(corpId)){
        return res.json({
            success: -1,
            desc:'no corp',
            data:{}
        });
    }
    reply.getMessage(req.query.corpId||req.query.corpid, 'activity', req.params.id)
    .then(function(result){
        if(result){
            var now = new Date();
            var replys = result.reply.map(function(elem){
                return {
                    id:elem._id,//留言id
                    canDelete:(function(){
                        if((now.valueOf()-elem.posttime.valueOf()) > (5*60*1000)){
                            return false;
                        }
                        if(req.query.userid !== elem.userid){
                            return false;
                        }
                        if(req.query.identity !== elem.identity){
                            return false;
                        }
                        if(req.query.ext !== elem.ext) {
                            return false;
                        }
                        return true;
                    })(),//5分钟内可以删除
                    userid:elem.userid,
                    name:elem.name,
                    identity:elem.identity,
                    ext:elem.ext,
                    avatar:'',
                    touser:elem.touser,
                    message:elem.message,
                    posttime:elem.posttime,
                    nowtime:now
                };
            });
            var promises = replys.map(function(elem){
                return wxUser.getUserByUserId(req.query.corpid||req.query.corpId, elem.userid).then(function(user){
                    elem.avatar = user.avatar || '';
                    var touserPromises = elem.touser.map(function(touser){
                        return wxUser.getUserByUserId(req.query.corpid || req.query.corpId, touser.userid).then(function(user){
                            touser.avatar = user ? (user.avatar || '') : '';
                            return Promise.resolve();
                        });
                    });
                    return Promise.all(touserPromises);
                });
            });
            return Promise.all(promises).then(function(){
                return Promise.resolve(replys);
            });
        }else{
            return Promise.resolve([]);
        }
    })
    .then(function(replys){
        return res.json({
            success: 0,
            desc:'success',
            data:{
                replys:replys
            }
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.delete('/activity/:id', function(req, res, next){
    var corpId = req.body.corpId||req.body.corpid;
    reply.getMessage(corpId, 'activity', req.params.id)
    .then(function(result){
        var del_reply = result.reply.find(function(elem){
            return elem._id.toString() === req.body.messageId;
        });
        if (del_reply) {
            if(del_reply.userid !== req.body.userid){
                return Promise.reject(new Error('您不能删除其他人的回复'));
            }
        }
        return reply.deleteMessage(corpId, 'activity', req.params.id, req.body.messageId);
    })
    .then(function(){
        return res.json({
            success: 0,
            desc: 'success',
            data:{}
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.post('/homework/:id', function(req, res, next){
    var corpId = req.body.corpId||req.body.corpid;
    if(util.isNullOrUndefined(corpId)){
        return res.json({
            success: -1,
            desc:'no corp',
            data:{}
        });
    }
    reply.postMessage(corpId,'homework', req.params.id, req.body)
    .then(function(result){
        return corpLib.getAppid(corpId, apptype.getAppType('homework'))
        .then(function(appid){
            var api = wechat.getCorpManager(corpId, appid)[appid];
            if(util.isArray(req.body.touser)){
                var promises = req.body.touser.map(function(user){
                    var url = 'http://' + config.getURL() + '/homework/message_push?user_id=' + user.userid + '&homework_id=' + req.params.id + '&corp_id=' + corpId;
                    switch(parseInt(user.identity)){
                    case 1://家长
                        url += '&type=3&identity=1&sid='+user.ext;
                        break;
                    case 2://老师
                        url += '&type=3&identity=2';
                        break;
                    case 3://创建者
                        url += '&type=1&identity=3';
                        break;
                    }
                    var message = {
                        to:{
                            touser:user.userid
                        },
                        msg:{
                            msgtype:'news',
                            news:{
                                articles:[
                                    {
                                        title:'作业任务:' + req.body.name + '@了你',
                                        description:'有新评论啦：'+req.body.message,
                                        url: url
                                    }
                                ]
                            }
                        },
                        safe:'0'
                    };
                    return MSG.sendMessage(api, message);
                });
                return Promise.all(promises);
            }
        });
    })
    .then(function(){
        return res.json({
            success:0,
            desc:'success',
            data:{}
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc:err.message,
            data:{}
        });
    });
});

router.get('/homework/:id', function(req, res, next){
    var corpId = req.query.corpId||req.query.corpid;
    if(util.isNullOrUndefined(corpId)){
        return res.json({
            success: -1,
            desc:'no corp',
            data:{}
        });
    }
    reply.getMessage(corpId, 'homework', req.params.id)
    .then(function(result){
        if(result){
            var now = new Date();
            var replys = result.reply.map(function(elem){
                return {
                    id:elem._id,//留言id
                    canDelete:(function(){
                        if((now.valueOf()-elem.posttime.valueOf()) > (5*60*1000)){
                            return false;
                        }
                        if(req.query.userid !== elem.userid){
                            return false;
                        }
                        if(req.query.identity !== elem.identity){
                            return false;
                        }
                        if(req.query.ext !== elem.ext) {
                            return false;
                        }
                        return true;
                    })(),//5分钟内可以删除
                    userid:elem.userid,
                    name:elem.name,
                    identity:elem.identity,
                    ext:elem.ext,
                    avatar:'',
                    touser:elem.touser,
                    message:elem.message,
                    posttime:elem.posttime,
                    nowtime:now
                };
            });
            var promises = replys.map(function(elem){
                return wxUser.getUserByUserId(corpId, elem.userid).then(function(user){
                    elem.avatar = user.avatar || '';
                    var touserPromises = elem.touser.map(function(touser){
                        return wxUser.getUserByUserId(corpId, touser.userid).then(function(user){
                            touser.avatar = user ? (user.avatar || '') : '';
                            return Promise.resolve();
                        });
                    });
                    return Promise.all(touserPromises);
                });
            });
            return Promise.all(promises).then(function(){
                return Promise.resolve(replys);
            });
        }else{
            return Promise.resolve([]);
        }
    })
    .then(function(replys){
        return res.json({
            success: 0,
            desc:'success',
            data:{
                replys:replys
            }
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.delete('/homework/:id', function(req, res, next){
    reply.deleteMessage(req.body.corpId||req.body.corpid, 'homework', req.params.id, req.body.messageId)
    .then(function(){
        return res.json({
            success: 0,
            desc: 'success',
            data:{}
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.post('/questionnair/:id', function(req, res, next){
    var corpId = req.body.corpId || req.body.corpid;
    if(util.isNullOrUndefined(corpId)){
        return res.json({
            success: -1,
            desc:'no corp',
            data:{}
        });
    }
    reply.postMessage(corpId,'questionnair', req.params.id, req.body)
    .then(function(result){
        return corpLib.getAppid(corpId, apptype.getAppType('questionnair'))
        .then(function(appid){
            var api = wechat.getCorpManager(corpId, appid)[appid];
            if(util.isArray(req.body.touser)){
                var promises = req.body.touser.map(function(user){
                    var url = 'http://' + config.getURL() + '/questionnair/message_push?' + 'corp_id=' + corpId + '&user_id='+user.userid + '&questionnaire_id=' + req.params.id;
                    switch(parseInt(user.identity)){
                    case 1://家长
                        url += '&type=3&identity=1&sid=' + user.ext;
                        break;
                    case 2://教师
                        url += '&type=3&identity=2';
                        break;
                    case 3://创建者
                        url += '&type=1&identity=3';
                        break;
                    }
                    var message = {
                        to:{
                            touser:user.userid
                        },
                        msg:{
                            msgtype:'news',
                            news:{
                                articles:[
                                    {
                                        title:'问卷调查:' + req.body.name + '@了你',
                                        description:'有新评论啦：'+req.body.message,
                                        url: url
                                    }
                                ]
                            }
                        },
                        safe:'0'
                    };
                    return MSG.sendMessage(api, message);
                });
                return Promise.all(promises);
            }
        });
    })
    .then(function(){
        return res.json({
            success:0,
            desc:'success',
            data:{}
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc:err.message,
            data:{}
        });
    });
});

router.get('/questionnair/:id', function(req, res, next){
    var corpId = req.query.corpId||req.query.corpid;
    if(util.isNullOrUndefined(corpId)){
        return res.json({
            success: -1,
            desc:'no corp',
            data:{}
        });
    }
    reply.getMessage(corpId, 'homework', req.params.id)
    .then(function(result){
        if(result){
            var now = new Date();
            var replys = result.reply.map(function(elem){
                return {
                    id:elem._id,//留言id
                    canDelete:(function(){
                        if((now.valueOf()-elem.posttime.valueOf()) > (5*60*1000)){
                            return false;
                        }
                        if(req.query.userid !== elem.userid){
                            return false;
                        }
                        if(req.query.identity !== elem.identity){
                            return false;
                        }
                        if(req.query.ext !== elem.ext) {
                            return false;
                        }
                        return true;
                    })(),//5分钟内可以删除
                    userid:elem.userid,
                    name:elem.name,
                    identity:elem.identity,
                    ext:elem.ext,
                    avatar:'',
                    touser:elem.touser,
                    message:elem.message,
                    posttime:elem.posttime,
                    nowtime:now
                };
            });
            var promises = replys.map(function(elem){
                return wxUser.getUserByUserId(corpId, req.query.userid).then(function(user){
                    elem.avatar = user.avatar || '';
                    var touserPromises = elem.touser.map(function(touser){
                        return wxUser.getUserByUserId(corpId, touser.userid).then(function(user){
                            touser.avatar = user ? (user.avatar || '') : '';
                            return Promise.resolve();
                        });
                    });
                    return Promise.all(touserPromises);
                });
            });
            return Promise.all(promises).then(function(){
                return Promise.resolve(replys);
            });
        }else{
            return Promise.resolve([]);
        }
    })
    .then(function(replys){
        return res.json({
            success: 0,
            desc:'success',
            data:{
                replys:replys
            }
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.delete('/questionnair/:id', function(req, res, next){
    reply.deleteMessage(req.body.corpId||req.body.corpid, 'questionnair', req.params.id, req.body.messageId)
    .then(function(){
        return res.json({
            success: 0,
            desc: 'success',
            data:{}
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});


module.exports = router;
