var express = require('express');
var router = express.Router();
var Promise = require('promise');
var homeworkMdl = require('../../model/school/homework');
var school_parent = require('../../model/school/school_parent');
var school_teacher = require('../../model/school/school_teacher');
var WxUser = require('../../model/contact/wxUser');
var MSG = require('../../api/msg.js');
var Wechat = require('../../api/wechat');
var util = require('util');
var base_config = require('../../api/config');
var appType = require('../../api/apptype');
//var corpLib = require('../../library/corp/index');

router.post('/save',function(req, res, next){
    corpLib.getAppid(req.body.corpId, appType.getAppType('homework'))
    .then(function(appid){
        if(req.body.corpId && req.body.homework){
            homeworkMdl.saveHomework(req.body.corpId, req.body.homework)
            .then(function(homework){
                res.json({success:0,desc:'success',data:{}});
                return Promise.resolve(homework);
            })
            .then(function(homework){
                if(homework.state == 1){
                    if(util.isNullOrUndefined(req.session.teacher)){
                        req.session.teacher = {name:'test'};
                    }
                    var parentHomeworkPromises = [];
                    var api = Wechat.getCorpManager(req.body.corpId, appid)[appid];
                    homework.parent.forEach(function(parent){
                        var tmp = {};
                        tmp.id = parent.id;
                        tmp.sid = parent.sid;
                        tmp.state = 0;
                        tmp.homeworkId = homework._id;
                        parentHomeworkPromises.push(homeworkMdl.createParentHomework(req.body.corpId, tmp).then(function(homework1){
                            return school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, parent.id, parent.sid).then(function(parentInfo){
                                if(parentInfo.wxuser){
                                    var message = {
                                        to:{
                                            touser:parentInfo.wxuser
                                        },
                                        msg:{
                                            msgtype:'news',
                                            news:{
                                                articles:[
                                                    {
                                                        title:decodeURI(decodeURI(homework.title)),
                                                        description:parentInfo.nickName + ',您好! 您有一份来自于[' + req.session.teacher.name + ']的作业通知，请及时处理',
                                                        url:'http://' + base_config.getURL()+'/homework/read_homework?type=3&corp_id='+req.body.corpId+'&appid='+appid + '&parentId=' + parent.id + '&sid='+parent.sid + '&homework_id=' + homework._id//api.getAuthorizeURL(,'youtour-wo')
                                                    }
                                                ]
                                            }
                                        },
                                        safe:'0'
                                    };
                                    // console.log("homework api = " + JSON.stringify(api)+ ",message = " + JSON.stringify(message));
                                    return MSG.sendMessage(
                                    api,

                                    message
                                    );
                                }
                            });
                        }));
                    });
                    return Promise.all(parentHomeworkPromises);
                }
                return Promise.resolve().catch(function (err) {

                });
            }).catch(function(err){
                return res.json({success:-1,desc:err.message, data:{}});
            });
        }else{
            res.json({success:-1,desc:'invalid param',data:{}});
        }
    })
    .catch(function(err){
        res.json({success:-1,desc:err.message,data:{}});
    });
});

router.post('/notify', function(req, res, next) {
    if (req.body && req.body.id && req.body.corpId) {
        corpLib.getAppid(req.body.corpId, appType.getAppType('homework'))
        .then(function(appid){
            var api = Wechat.getCorpManager(req.body.corpId, appid)[appid];
            homeworkMdl.findHomeworkbyId(req.body.corpId, req.body.id).then(function(homework) {
                return homeworkMdl.getReadingStatus(req.body.corpId, req.body.id, 0).then(function(homeworks) {
                    var promises = homeworks.map(function(parent) {
                        return school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, parent.id, parent.sid).then(function(parentInfo){
                            if(parentInfo.wxuser){
                                var message = {
                                    to:{
                                        touser:parentInfo.wxuser
                                    },
                                    msg:{
                                        msgtype:'news',
                                        news:{
                                            articles:[
                                                {
                                                    title:decodeURI(decodeURI(homework.title)),
                                                    description:parentInfo.nickName + ',您好! 您有一份来自于[' + req.session.teacher.name + ']的作业通知，请及时处理',
                                                    url:'http://' + base_config.getURL()+'/homework/read_homework?type=3&corp_id='+req.body.corpId+'&appid='+appid + '&parentId=' + parent.id + '&sid='+parent.sid + '&homework_id=' + homework._id//api.getAuthorizeURL(,'youtour-wo')
                                                }
                                            ]
                                        }
                                    },
                                    safe:'0'
                                };
                                // console.log("homework api = " + JSON.stringify(api)+ ",message = " + JSON.stringify(message));
                                return MSG.sendMessage(
                                api,

                                message
                                );
                            }
                        });
                    });
                    return Promise.all(promises);
                });
            });

        }).then(function(){
            return res.json({
                success: 0,
                desc:'success',
                data:{}
            });
        }).catch(function(err){
            return res.json({
                success: -1,
                desc:err.message,
                data:{}
            });
        });
        
    } else {
        res.json({
            success: -1,
            desc:'invalid param',
            data:{}
        });
    }
});

router.post('/detail',function(req, res, next){
    console.log('/homework/detail.body = ' + JSON.stringify(req.body));
    if(req.body && req.body.id && req.body.corpId){
        return new Promise(function(resolve, reject) {
            if(parseInt(req.body.type) == 3 || parseInt(req.body.type) == 4) {
                return homeworkMdl.parentHomeworkUpdateState(req.body.corpId, req.body.id, req.body.userid, req.body.sid, 1)
                .then(function(){
                    resolve();
                }).catch(function(err) {
                    reject(err);
                });
            }
            return resolve();
        }).then(function(){
            return homeworkMdl.findHomeworkbyId(req.body.corpId,req.body.id);
        })
        .then(function(data){
            var homework = {
                createPerson:data.createPerson,
                homeworkType:data.homeworkType,
                title:data.title,
                content:data.content,
                voice:data.voice,//语音id
                pics:data.pics,
                attachment:data.attachment,
                teacher:data.teacher,
                parent:data.parent,
                class:data.class,
                editTime:data.editTime,//编辑时间
                // beginTime:homework.beginTime,
                // endTime:homework.endTime,
                beginTime:data.beginTime,
                endTime:data.endTime,
                isNotifyBeforeBegin:data.isNotifyBeforeBegin,
                isNotifyBeforeEnd:data.isNotifyBeforeEnd,
                priority:data.priority,
                state:data.state,
                closeReason:data.closeReason
            };
            return school_teacher.getTeacherAllInfoByUserId(req.body.corpId,homework.createPerson)
               .then(function(user){
                   homework.personName = user.teacherName;
                   homework.personPics = user.weixin.avatar || '';
                   return Promise.resolve(homework);
               });
        }).then(function(homework){
            return homeworkMdl.getReadingStatus(req.body.corpId,req.body.id,0)//取得未读家长
            .then(function(parentHomeworks){
                homework.unreadPerson = [];
                var promises = [];
                parentHomeworks.forEach(function(parentHomework){
                    var tmp = {id:parentHomework.id,sid:parentHomework.sid};
                    // homework.unreadPerson.push(tmp);
                    promises.push(school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId,parentHomework.id, parentHomework.sid)
                    .then(function(parent){
                        tmp.name = parent.name;
                        tmp.bakname = parent.nickName;
                        tmp.pic = parent.avatar;
                        homework.unreadPerson.push(tmp);
                    }));
                });
                return Promise.all(promises).then(function(){
                    return Promise.resolve(homework);
                });
            });
        }).then(function(homework){

            return res.json({success:0,desc:'success',data:homework});
        }).catch(function(err){
            return res.json({success:-1,desc:err.message,data:{}});
        });
    }else{
        res.json({success:-1,desc:'invalid param',data:{}});
    }
});

router.post('/close',function(req, res, next){
    if(req.body && req.body.id){
        corpLib.getAppid(req.body.corpId, appType.getAppType('homework'))
        .then(function(appid){
            var api = Wechat.getCorpManager(req.body.corpId, appid)[appid];
            return homeworkMdl.findHomeworkbyId(req.body.corpId, req.body.id)
            .then(function(homework){
                if(util.isNullOrUndefined(homework)){
                    return res.json({success:-1,desc:'no homework with special id:'+req.body.id, data:{}});
                }else if(homework.state === 1){
                    return homeworkMdl.closeHomework(req.body.corpId,{id:req.body.id,reason:req.body.reason}).then(function(){
                        return res.json({success:0,desc:'success',data:{}});
                    }).then(function(){
                        var promises = homework.parent.map(function(parent) {
                            return school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, parent.id, parent.sid).then(function(parentInfo){
                                if(parentInfo.wxuser){
                                    var message = {
                                        to:{
                                            touser:parentInfo.wxuser
                                        },
                                        msg:{
                                            msgtype:'news',
                                            news:{
                                                articles:[
                                                    {
                                                        title:decodeURI(decodeURI(homework.title)),
                                                        description:parentInfo.nickName + ',您好! 来自于[' + req.session.teacher.name + ']的作业任务，已关闭。请了解！',
                                                        url:'http://' + base_config.getURL()+'/homework/read_homework?type=3&corp_id='+req.body.corpId+'&appid='+appid + '&parentId=' + parent.id + '&sid='+parent.sid + '&homework_id=' + homework._id//api.getAuthorizeURL(,'youtour-wo')
                                                    }
                                                ]
                                            }
                                        },
                                        safe:'0'
                                    };
                                    // console.log("homework api = " + JSON.stringify(api)+ ",message = " + JSON.stringify(message));
                                    return MSG.sendMessage(
                                    api,

                                    message
                                    );
                                }
                            });
                        });
                        return Promise.all(promises);
                    });
                }else{
                    return res.json({success:-1,desc:'only published homework can be deleted', data:{}});
                }
            });
        }).catch(function(err) {
            res.json({
                success: -1,
                desc: err.message,
                data:{}
            });
        });
    }else{
        return res.json({success:-1,desc:'invalid params', data:{}});
    }
});

router.post('/delete', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1,desc:'invalid request',data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1,desc:'invalid corp',data:{}});
    }
    if(util.isNullOrUndefined(req.body.state)){
        return res.json({success:-1,desc:'invalid state',data:{}});
    }
    if(req.body.state < 0 || req.body.state > 4){
        return res.json({success:-1,desc:'invalid state',data:{}});
    }

    if(req.body.state < 3){
        homeworkMdl.deleteHomework(req.body.corpId, req.body.id).then(function(){
            return res.json({success:0,desc:'success',data:{}});
        }).catch(function(err){
            return res.json({success:-1,desc:err.message,data:{}});
        });
    }else{
        homeworkMdl.deleteParentHomework(req.body.corpId, req.body.userid,req.body.sid,req.body.id).then(function(){
            return res.json({success:0,desc:'success',data:{}});
        }).catch(function(err){
            return res.json({success:-1,desc:err.message,data:{}});
        });
    }
});
router.post('/get',function(req, res, next){
    if(req.body && req.body.corpId && req.body.userid){
        var homeworks = [];
        if(req.body.type == 3 || req.body.type == 4){
            school_parent.getParentsByUserId(req.body.corpId, req.body.userid).then(function(parents){
                var promises = [];
                parents.forEach(function(parent){
                    promises.push(homeworkMdl.findHomeworksByPersonAndReadingState(req.body.corpId, parent.userid, req.body.type-3).then(function(parentHomeworks){
                        var tmp_promises = [];
                        parentHomeworks.forEach(function(parentHomework){
                            tmp_promises.push(homeworkMdl.findHomeworkbyId(req.body.corpId,parentHomework.homeworkId).then(function(homework){
                                return school_teacher.getTeacherAllInfoByUserId(req.body.corpId,homework.createPerson).then(function(user){
                                    var hh = {
                                        createPerson:homework.createPerson,//创建者id
                                        personName:user.teacherName,//创建者名称,
                                        headPic:user.weixin.avatar||'',//创建者头像
                                        type:homework.homeworkType,//作业类型0.课后作业，1.假期作业
                                        id:homework._id,//作业id,
                                        title:homework.title,//作业标题
                                        editTime:homework.editTime,//最后编辑时间
                                        sid:parentHomework.sid
                                    };
                                    homeworks.push(hh);
                                });
                            }));
                        });
                        return Promise.all(tmp_promises);
                    }));
                });
                return Promise.all(promises);
            }).then(function(){
                return res.json({success:0,desc:'success',data:{homework:homeworks}});
            }).catch(function(err){
                return res.json({success:-1,desc:err.message,data:{}});
            });
        }else{
            // WxUser.getUserByUserId(req.body.corpId,req.body.userid)
            school_teacher.getTeacherAllInfoByUserId(req.body.corpId, req.body.userid)
            .then(function(user){
                return homeworkMdl.findHomeworksByCreatorAndState(req.body.corpId, req.body.userid, req.body.type)
                .then(function(homeworks){
                    var result = [];
                    homeworks.forEach(function(homework){
                        var tmp = {
                            createPerson:req.body.userid,//创建者id
                            personName:user.teacherName,//创建者名称,
                            headPic:user.weixin.avatar||'',//创建者头像
                            type:homework.homeworkType,//作业类型0.课后作业，1.假期作业
                            id:homework._id,//作业id,
                            title:homework.title,//作业标题
                            editTime:homework.editTime//最后编辑时间
                        };
                        result.push(tmp);
                    });
                    return res.json({success:0,desc:'success',data:{homework:result}});
                });
            }).catch(function(err){
                return res.json({success:-1,desc:err.message,data:{}});
            });
        }
    }
});
module.exports = router;
