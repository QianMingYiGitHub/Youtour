var util = require('util');
var express = require('express');
var router = express.Router();
var Promise = require('promise');
var wxUser = require('../../model/contact/wxUser');
var base_config = require('../../api/config');

var school_department = require('../../model/school/school_department');
var school_teacher = require('../../model/school/school_teacher');
var school_student = require('../../model/school/school_student');
var school_parent = require('../../model/school/school_parent');

var Activity = require('../../model/school/activity');
var Rate = require('../../model/school/rate');
var MSG = require('../../api/msg.js');
var Wechat = require('../../api/wechat');
//var corpLib = require('../../library/corp/index');
var appType = require('../../api/apptype');
var logger = require('../../api/logger').logger;

var activity_status = {
    draft: 0,//草稿
    published: 1,//已发布
    closed:2//已关闭
};
router.post('/save',function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.activity)){
        return res.json({success:-1, desc:'no activity', data:{}});
    }
    corpLib.getAppid(req.body.corpId, appType.getAppType('activity'))
    .then(function(appid){
        Activity.saveActivity(req.body.corpId, req.body.activity).then(function(activity){
            if(activity.state === activity_status.published){
                //发布的活动通知，需要消息提醒相关所有人
                var tmpactivitys = [];
                var joinerkey = {};
                var title = decodeURI(decodeURI(activity.title));
                activity.leader.forEach(function(leader){
                    if(util.isNullOrUndefined(leader.ext)){
                        leader.ext = '';
                    }
                    var key = '' + leader.id + '_' + leader.identity + '_' + leader.ext;
                    if(util.isNullOrUndefined(joinerkey[key])){
                        var tmp = {activity:{}};
                        tmp.activityId = activity._id;
                        tmp.id = leader.id;
                        tmp.identity = leader.identity;
                        tmp.ext = leader.ext;
                        tmp.title = title;
                        tmpactivitys.push(tmp);
                        joinerkey[key] = true;
                    }
                });
                activity.partner.forEach(function(partner){
                    if(util.isNullOrUndefined(partner.ext)){
                        partner.ext = '';
                    }
                    var key = '' + partner.id + '_' + partner.identity + '_' + partner.ext;
                    if(util.isNullOrUndefined(joinerkey[key])){
                        var tmp = {};
                        tmp.activityId = activity._id;
                        tmp.id = partner.id;
                        tmp.identity = partner.identity;
                        tmp.ext = partner.ext;
                        tmp.title = activity.title;
                        tmpactivitys.push(tmp);
                        joinerkey[key] = true;
                    }
                });
                var api = Wechat.getCorpManager(req.body.corpId,appid)[appid];
                var promises = [];
                tmpactivitys.forEach(function(tmp_activity){
                    logger.info('sendMessage.activity = ' + JSON.stringify(tmp_activity));
                    promises.push(Activity.hasActivityInJoniner(req.body.corpId, tmp_activity).then(function(isHas){
                        if(isHas === false){
                            // "&user_id=" + user_id + "&type=" + type + "&activity_id=" + activity_id + "&corp_id=" + corp_id + "&sid=" + sid + "&identity=" + identity;
                            var argvs = [
                                'type=3',
                                'corp_id=' + req.body.corpId,
                                'activity_id=' + tmp_activity.activityId, 
                                'user_id=' + tmp_activity.id,
                                'identity=' + tmp_activity.identity
                            ];
                            if(tmp_activity.identity === 1) {
                                argvs.push('sid=' + tmp_activity.ext);
                            }
                            return Activity.saveActivityToJoiner(req.body.corpId, tmp_activity).then(function(){
                                if(parseInt(tmp_activity.identity) === 1){
                                    return school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, tmp_activity.id,tmp_activity.ext).then(function(info){
                                        return Promise.resolve({wxuser:info.wxuser, name:info.nickName,title:tmp_activity.title});
                                    });
                                }else if(parseInt(tmp_activity.identity) === 2){
                                    return school_teacher.getTeacherAllInfoByUserId(req.body.corpId, tmp_activity.id).then(function(info){
                                        return Promise.resolve({wxuser:info.weixin.userid, name:info.teacherName, title:tmp_activity.title});
                                    });
                                }
                            }).then(function(user){
                                var message = {
                                    to:{
                                        touser:user.wxuser
                                    },
                                    msg:{
                                        msgtype:'news',
                                        news:{
                                            articles:[
                                                {
                                                    title:(user.name) + ' 您好',
                                                    description:decodeURI(decodeURI(user.title)) + ' 活动通知',
                                                    url: 'http://' + base_config.getURL() + '/activity/read_activity?' + argvs.join('&')
                                                }
                                            ]
                                        }
                                    },
                                    safe:'0'
                                };
                                return MSG.sendMessage( api,  message );
                            });
                        }
                    }));
                });
                return Promise.all(promises);
            }else{
                return Promise.resolve();
            }
        }).then(function () {
            return res.json({success:0, desc:'success', data:{}});
        });
    })
    .catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/close',function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.id)){
        return res.json({success:-1, desc:'no id', data:{}});
    }
    corpLib.getAppid(req.body.corpId, appType.getAppType('activity'))
    .then(function(appid){
        return Activity.getActivity(req.body.corpId,req.body.id)
        .then(function(activity){
            if(activity.createPerson !== req.session.teacher.id){
                return Promise.reject(new Error('您不是发布人，没有权限关闭活动'));
            }
            if(activity.isHideFromHistory){
                return Promise.reject(new Error('已从用户历史记录中删除的不能进行操作'));
            }
            if(activity.state === 0){
                return Promise.reject(new Error('草稿不允许关闭'));
            }
            if(activity.state === 2){
                return Promise.reject(new Error('不允许重复关闭'));
            }
            return Activity.saveActivity(req.body.corpId, {id:req.body.id, state:2, closeReason:req.body.reason||'',editTime:Date.now()});
        }).then(function(activity){
            var promises = [];
            activity.leader.forEach(function(leader){
                var argvs = [
                    'type=3',
                    'corp_id=' + req.body.corpId,
                    'activity_id=' + req.body.id, 
                    'user_id=' + leader.id,
                    'identity=' + leader.identity
                ];
                if(parseInt(leader.identity) === 1){
                    argvs.push('sid=' + leader.ext);
                    promises.push(school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId,leader.id,leader.ext).then(function(info){
                        return Promise.resolve({userid:info.wxuser,url:'http://' + base_config.getURL() + '/activity/read_activity?' + argvs.join('&')});
                    }));
                }else if(parseInt(leader.identity) === 2){
                    promises.push(school_teacher.getTeacherAllInfoByUserId(req.body.corpId,leader.id).then(function(info){
                        return Promise.resolve({userid:info.weixin.userid,url:'http://' + base_config.getURL() + '/activity/read_activity?' + argvs.join('&')});
                    }));
                }
            });
            return Promise.all(promises).then(function(ids){
                var proms = ids.map(function (id) {
                    var api = Wechat.getCorpManager(req.body.corpId,appid)[appid];
                    var message = {
                        to:{
                            touser:id.userid
                        },
                        msg:{
                            msgtype:'news',
                            news:{
                                articles:[
                                    {
                                        title:decodeURI(decodeURI(activity.title)) + ' 关闭通知',
                                        description:req.body.reason,
                                        url:id.url
                                    }
                                ]
                            }
                        },
                        safe:'0'
                    };
                    return MSG.sendMessage( api,  message );
                });
                return Promise.all(proms);
            }).then(function(){
                return res.json({success:0, desc:'success', data:{}});
            });
        });
    })
    .catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/get',function(req, res, next){//
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no userid', data:{}});
    }
    if(util.isNullOrUndefined(req.body.type)){
        return res.json({success:-1, desc:'no type', data:{}});
    }
    if(util.isNumber(req.body.type) === false){
        return res.json({success:-1, desc:'type isnot Number', data:{}});
    }
    if((req.body.type < 0) || (req.body.type > 4)){
        return res.json({success:-1, desc:'type is invalid', data:{}});
    }
    var activity_array = [];
    Promise.resolve()
    .then(function(){
        if(req.body.type < 3){
            return Activity.queryAllActitivyByCreatorAndState(req.body.corpId,req.body.userid,req.body.type).then(function(activitys){
                var promises = [];
                activitys.forEach(function(activity){
                    var tmp = {
                        id:activity._id,
                        createPerson:activity.createPerson,
                        title:activity.title,
                        identity:2,
                        ext:'',
                        editTime:activity.editTime,
                        state:activity.state
                    };
                    activity_array.push(tmp);
                    promises.push(school_teacher.getTeacherAllInfoByUserId(req.body.corpId, activity.createPerson).then(function(info){
                        tmp.personName = info.teacherName;
                        tmp.headPic = info.weixin.avatar;
                    }));
                });
                return Promise.all(promises);
            });
        }else{
            return Activity.queryAllActitivyByJoinerAndState(req.body.corpId, req.body.userid, parseInt(req.body.type)-3).then(function(activitys){
                var promises = [];
                activitys.forEach(function(activity){
                    var tmp = {
                        id:activity.activityId,
                        identity:activity.identity,
                        ext:activity.ext,
                        sid:activity.ext
                    };
                    activity_array.push(tmp);
                    promises.push(Activity.getActivity(req.body.corpId,activity.activityId).then(function(info){
                        tmp.createPerson = info.createPerson;
                        tmp.editTime = info.editTime;
                        tmp.state = info.state;
                        tmp.title = info.title;
                        return school_teacher.getTeacherAllInfoByUserId(req.body.corpId,info.createPerson).then(function(user){
                            tmp.personName = user.teacherName;
                            tmp.headPic = user.weixin.avatar;
                        });
                    }));
                });
                return Promise.all(promises);
            });
        }
    }).then(function(){
        return res.json({success:0, desc:'success', data:{activity:activity_array}});
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});
//通知未阅人员
router.post('/notify', function (req, res, next) {
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.id)){
        return res.json({success:-1, desc:'no id', data:{}});
    }
    corpLib.getAppid(req.body.corpId, appType.getAppType('activity'))
    .then(function(appid){
        return Activity.getActivity(req.body.corpId, req.body.id)
            .then(function(activity){
                res.json({
                    success: 0,
                    desc: 'success',
                    data:{}
                })
                var api = Wechat.getCorpManager(req.body.corpId,appid)[appid];
                return Activity.queryAllActitivyOfJoinerByState(req.body.corpId,req.body.id, 0)
                    .then(function(joiners){
                        console.log('notify.unreader = ' + JSON.stringify(joiners));
                        var unreadRole = {};
                        var title = decodeURI(decodeURI(activity.title));
                        joiners.forEach(function(joiner){
                            var key = '' + joiner.id + '_' + joiner.identity + '_' + (joiner.ext||'');
                            if(util.isNullOrUndefined(unreadRole[key])){
                                unreadRole[key] = {
                                    id:joiner.id,
                                    identity:joiner.identity,//1:家长，2:教职工
                                    ext1:joiner.ext//当身份为家长时，ext1为sid，否则为空
                                };
                            }
                        });
                        console.log('unreadRole = ' + JSON.stringify(unreadRole));
                        var promises = Object.keys(unreadRole).map(function(elem){
                            return new Promise(function (resolve, reject) {
                                if(unreadRole[elem].identity === 1){
                                    return school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, unreadRole[elem].id, unreadRole[elem].ext1).then(function(info){
                                        return resolve({
                                            wxuser:unreadRole[elem].id,
                                            name:info.nickName
                                        });
                                    }).catch(function(err){
                                        console.log('getParentAllInfoByUserIdAndSid.err = ' + err.message);
                                        return reject(err);
                                    });
                                }else if(unreadRole[elem].identity === 2){
                                    return school_teacher.getTeacherAllInfoByUserId(req.body.corpId, unreadRole[elem].id).then(function(info){
                                        return resolve({
                                            wxuser:unreadRole[elem].id,
                                            name:info.teacherName
                                        });
                                    }).catch(function(err){
                                        console.log('getTeacherAllInfoByUserId.err = ' + err.message);
                                        return reject(err);
                                    });
                                }
                            }).then(function(user){
                                var message = {
                                    to:{
                                        touser:user.wxuser
                                    },
                                    msg:{
                                        msgtype:'news',
                                        news:{
                                            articles:[
                                                {
                                                    title:(user.name) + ' 您好',
                                                    description:title + ' 活动通知'
                                                }
                                            ]
                                        }
                                    },
                                    safe:'0'
                                };
                                return MSG.sendMessage( api,  message );
                            }).catch(function(err){
                                console.log('350.err = ' + err.message);
                                return Promise.reject(err);
                            });
                        });
                        return Promise.all(promises);
                    });
            }).then(function(){
            });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc:err.message,
            data:{}
        });
    });
})

router.post('/detail',function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.id)){
        return res.json({success:-1, desc:'no id', data:{}});
    }
    if(util.isNumber(req.body.identity)===false){
        return res.json({success:-1, desc:'identity isnot number', data:{}});
    }
    var activity_data = {leader:[],partner:[],unreadPerson:[]};
    Activity.getActivity(req.body.corpId, req.body.id).then(function(activity){
        activity_data.createPerson = activity.createPerson;
        activity_data.title = activity.title;
        activity_data.content = activity.content;
        activity_data.voice = activity.voice;
        activity_data.pics = activity.pics;
        activity_data.attachment = activity.attachment;
        activity_data.createTime = activity.createTime;
        activity_data.editTime = activity.editTime;
        activity_data.beginTime = activity.beginTime;
        activity_data.endTime = activity.endTime;
        activity_data.isNotifyBeforeBegin = activity.isNotifyBeforeBegin;
        activity_data.isNotifyBeforeEnd = activity.isNotifyBeforeEnd;
        activity_data.priority = activity.priority;
        activity_data.state = activity.state;
        return school_teacher.getTeacherAllInfoByUserId(req.body.corpId, activity.createPerson).then(function(user){
            activity_data.personName = user.teacherName;
            activity_data.personPics = user.weixin.avatar;
            return Promise.resolve(activity);
        });
    }).then(function(activity){
        var promises = [];
        activity.leader.forEach(function(leader){
            /**
             *       id:String,
      name:String,
      pic:String,
      identity:Number,//1:家长，2:教职工
      ext1:String//当身份为家长时，ext1为sid，否则为空
      ext2:String//当身份为家长时，ext2为家长的备注名称
             */
            var tmpleader = {id:leader.id, identity:leader.identity, ext1:leader.ext,ext2:''};
            activity_data.leader.push(tmpleader);
            if(parseInt(leader.identity) === 1){
                promises.push(school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, leader.id, leader.ext).then(function(info){
                    tmpleader.name = info.realName;
                    tmpleader.ext2 = info.nickName;
                    tmpleader.pic = info.avatar;
                }));
            }else if(parseInt(leader.identity) === 2){
                promises.push(school_teacher.getTeacherAllInfoByUserId(req.body.corpId, leader.id).then(function(info){
                    tmpleader.name = info.teacherName;
                    tmpleader.pic = info.weixin.avatar;
                }));
            }
        });
        return Promise.all(promises).then(function(){
            return Promise.resolve(activity);
        });
    }).then(function(activity){
        var promises = [];
        activity.partner.forEach(function(leader){
            var tmpleader = {id:leader.id, identity:leader.identity, ext1:leader.ext};
            activity_data.partner.push(tmpleader);
            if(parseInt(leader.identity) === 1){
                promises.push(school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, leader.id,leader.ext).then(function(info){
                    tmpleader.name = info.realName;
                    tmpleader.ext2 = info.nickName;
                    tmpleader.pic = info.avatar;
                }));
            }else if(parseInt(leader.identity) === 2){
                promises.push(school_teacher.getTeacherAllInfoByUserId(req.body.corpId, leader.id).then(function(info){
                    tmpleader.name = info.teacherName;
                    tmpleader.pic = info.weixin.avatar;
                }));
            }
        });
        return Promise.all(promises).then(function(){
            return Promise.resolve(activity);
        });
    }).then(function(activity){
        return Activity.queryAllActitivyOfJoinerByState(req.body.corpId,req.body.id, 0)
        .then(function(joiners){
            console.log('detail.unreadjoiner = ' + JSON.stringify(joiners));
            var promises = [];
            joiners.forEach(function(joiner){
                var tmpunread = {
                    id:joiner.id,
                    identity:joiner.identity,//1:家长，2:教职工
                    ext1:joiner.ext//当身份为家长时，ext1为sid，否则为空
                };
                activity_data.unreadPerson.push(tmpunread);
                if(parseInt(joiner.identity) === 1){
                    promises.push(school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, joiner.id, joiner.ext).then(function(info){
                        console.log('unread.parent.info = ' + JSON.stringify(info));
                        tmpunread.name = info.realName;
                        tmpunread.ext2 = info.nickName;
                        tmpunread.pic = info.avatar;
                    }));
                }else if(parseInt(joiner.identity) === 2){
                    promises.push(school_teacher.getTeacherAllInfoByUserId(req.body.corpId, joiner.id).then(function(info){
                        console.log('unread.teacher.info = ' + JSON.stringify(info));
                        tmpunread.name = info.teacherName;
                        tmpunread.pic = info.weixin.avatar;
                    }));
                }
            });
            return Promise.all(promises);
        });
    }).then(function(){
        
        if(parseInt(req.body.identity) !== 3){
            var activityInfo = {
                activityId:req.body.id,
                id:(req.session.wx?(req.session.wx.userid||req.body.userid) : req.body.userid),
                identity:req.body.identity,
                ext:req.body.ext,
                state:1
            };
            Activity.updateActivityToJoiner(req.body.corpId,activityInfo);
        }
        // var activityInfo = {
        //     activityId:req.body.id,
        //     id:req.session.userid,
        //     identity:req.body.identity,
        //     ext:req.body.ext,
        //     state:1
        // };
        // if(req.body.identity !== 3){
        //     Activity.updateActivityToJoiner(req.body.corpId,activityInfo);
        // }
        return res.json({success:0, desc:'success', data:{activity:activity_data}});
    }).catch(function(err){
        return res.json({success:-1,desc:err.message, data:{}});
    });
});

router.post('/delete',function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.id)){
        return res.json({success:-1, desc:'no id', data:{}});
    }
    if(util.isNullOrUndefined(req.body.identity)){
        return res.json({success:-1, desc:'no identity', data:{}});
    }
    if(util.isNullOrUndefined(req.body.state)){
        return res.json({success:-1, desc:'no state', data:{}});
    }
    if(util.isNumber(req.body.identity) === false){
        return res.json({success:-1, desc:'identity isnot number', data:{}});
    }
    if(util.isNumber(req.body.state) === false){
        return res.json({success:-1, desc:'state isnot number', data:{}});
    }
    if(req.body.state < 0 || req.body.state > 4){
        return res.json({success:-1, desc:'state is invalid', data:{}});
    }
    if(req.body.state < 3){
        return Activity.getActivity(req.body.corpId, req.body.id).then(function(activity){
            if(activity.state !== req.body.state){
                return res.json({success:-1, desc:'state is error', data:{}});
            }if(activity.createPerson !== req.session.teacher.id){
                return res.json({success:-1, desc:'您不是发布人，没有权限删除活动', data:{}});
            }else{
                if(req.body.state === 0){
                    return Activity.deleteMainActivity(req.body.corpId, req.body.id).then(function(){
                        return res.json({success:0, desc:'success', data:{}});
                    }).catch(function(err){
                        return res.json({success:-1, desc:err.message, data:{}});
                    });
                }else{
                    return Activity.deleteMainActivityFromHistory(req.body.corpId, req.body.id).then(function(){
                        return res.json({success:0, desc:'success', data:{}});
                    }).catch(function(err){
                        return res.json({success:-1, desc:err.message, data:{}});
                    });
                }
            }
        });
    }else{
        return Activity.deleteJoinerActivityFromHistory(
            req.body.corpId,
            req.body.id,
            req.session.wx.userid,
            req.body.identity,
            req.body.ext)
        .then(function(){
            return res.json({success:0, desc:'success', data:{}});
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    }
});

module.exports = router;
