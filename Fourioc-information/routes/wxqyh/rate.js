var util = require('util');
var express = require('express');
var router = express.Router();
var Promise = require('promise');
var wxUser = require('../../model/contact/wxUser');
// var Teacher = require('../../model/school/teacher');
// var Parent = require('../../model/school/parent');
// var Student = require('../../model/school/student');
// var Department = require('../../model/school/department');

var school_teacher = require('../../model/school/school_teacher');
var school_parent = require('../../model/school/school_parent');
var school_student = require('../../model/school/school_student');

var base_config = require('../../api/config');
var Rate = require('../../model/school/rate');
var MSG = require('../../api/msg.js');
var Wechat = require('../../api/wechat');
var appType = require('../../api/apptype');
//var corpLib = require('../../library/corp/index');

//新建评语+通知家长
router.post('/deliver',function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.rate)){
        return res.json({success:-1, desc:'no rate', data:{}});
    }
    corpLib.getAppid(req.body.corpId, appType.getAppType('behavior')).then(function(appid){
        var teacherName = '';
        school_teacher.getTeacherAllInfoByUserId(req.body.corpId, req.body.rate.createPerson).then(function(info){
            teacherName = info.teacher_name;
        }).then(function(){
            return Rate.saveRate(req.body.corpId, req.body.rate);//数据库插入信息+老师信息
        }).then(function(rate){
            res.json({success:0, desc:'success', data:{}});
            if(rate.state === 1){
                var parentRate = [];
                var MsgPromises = [];
                var api = Wechat.getCorpManager(req.body.corpId,appid)[appid];
                rate.parent.forEach(function(parent){
                    var tmp = {};
                    tmp.id = parent.id;
                    tmp.sid = parent.sid;
                    tmp.state = 0;
                    tmp.rateId = rate._id;
                    parentRate.push(Rate.createParentRate(req.body.corpId, tmp)); //mongse写法 
                    MsgPromises.push(school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId,parent.id,parent.sid)
                    .then(function(info){
                        return school_student.findStudentById(req.body.corpId, parent.sid).then(function(student){
                            var message = {
                                to:{
                                    touser:info.wxuser
                                },
                                msg:{
                                    msgtype:'news',
                                    news:{
                                        articles:[
                                            {
                                                title:student.name + '的日常表现',
                                                description:teacherName + ':' + decodeURI(decodeURI(rate.content)),
                                                url:'http://' + base_config.getURL() + '/rate/read_rate?type=3&identity=2&corp_id='+req.body.corpId+'&appid='+req.session.appid + '&pid=' + parent.id + '&sid='+parent.sid + '&rate_id=' + rate._id//api.getAuthorizeURL(,'youtour-wo')
                                            }
                                        ]
                                    }
                                },
                                safe:'0'
                            };
                            return MSG.sendMessage(
                                api,
                                message
                                );
                        });
                    })
                    );
                });
                
                Promise.all(parentRate).then(function(rates){
                    //调用微信api通知家长
                    return Promise.all(MsgPromises);
                }).catch(function(err){
                    console.log(err.message);
                });
            }
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    })
    .catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});
router.post('/list',function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.info)){
        return res.json({success:-1, desc:'no info', data:{}});
    }
    var info = req.body.info;
    if(util.isNumber(info.identity) === false){
        return res.json({success:-1, desc:'identity is error', data:{}});
    }
    if(util.isArray(info.state) === false){
        return res.json({success:-1, desc:'info.state is not array', data:{}});
    }
    if(info.identity === 1){
        Rate.findTeacherRateByCreatorAndState(req.body.corpId, info.userid, info.state)
        .then(function(rates){
            var creatorPromises = [];
            var list = [];
            rates.forEach(function(rate){
                var parentPromises = [];
                var tmp = {creator:{},rate:{}};
                var parents = [];
                tmp.creator.id = rate.createPerson;
                tmp.rate.id = rate._id;
                tmp.rate.state = rate.state;
                tmp.rate.editTime = rate.editTime;
                list.push(tmp);
                rate.parent.forEach(function(parent){
                    parentPromises.push(school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, parent.id, parent.sid)
                    .then(function(parentinfo){
                        return Promise.resolve(parentinfo.nickName);
                    }));
                });
                creatorPromises.push(school_teacher.getTeacherAllInfoByUserId(req.body.corpId, rate.createPerson)
                .then(function(user){
                    tmp.creator.name = user.teacherName;
                    tmp.creator.pic = user.weixin.avatar;
                    return Promise.all(parentPromises);
                }).then(function(names){
                    tmp.rate.title = '';
                    names.forEach(function(name){
                        tmp.rate.title += '[' + name + ']';
                    });
                    tmp.rate.title += ' 的评语';
                }));
            });
            return Promise.all(creatorPromises).then(function(){
                return res.json({success:0, desc:'success', data:{
                    list:list
                }});
            });
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    }else if(info.identity === 2){
        Rate.findParentRateByUserAndState(req.body.corpId, info.userid, info.state)
        .then(function(rates){
            var creatorPromises = [];
            var list = [];
            rates.forEach(function(rate){
                var tmp = {creator:{},rate:{}};
                tmp.rate.id = rate.rateId;
                tmp.rate.state = rate.state;
                tmp.rate.sid = rate.sid;
                list.push(tmp);
                creatorPromises.push(Rate.findRateInfobyId(req.body.corpId, rate.rateId)
                .then(function(rateInfo){
                    tmp.creator.id = rateInfo.createPerson;
                    tmp.rate.editTime = rateInfo.editTime;
                    return school_teacher.getTeacherAllInfoByUserId(req.body.corpId, rateInfo.createPerson);
                }).then(function(user){
                    tmp.creator.name = user.name;
                    tmp.creator.pic = user.avatar;
                    return school_student.findStudentById(req.body.corpId, rate.sid);
                }).then(function(student){
                    tmp.rate.title = student.name + '的日常表现';
                }));
            });
            return Promise.all(creatorPromises).then(function(){
                return res.json({success:0, desc:'success', data:{
                    list:list
                }}); 
            });
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    }else{
        return res.json({success:-1, desc:'identity is error', data:{}});
    }
});

router.post('/get',function(req, res, next){//查看comment
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.info)){
        return res.json({success:-1, desc:'no info', data:{}});
    }
    var info = req.body.info;
    if(util.isNumber(info.identity) === false){
        return res.json({success:-1, desc:'identity is error', data:{}});
    }
    if(util.isString(info.rateId) === false){
        return res.json({success:-1, desc:'info.rateId is not String', data:{}});
    }
    if(info.identity === 1 || info.identity === 2||info.identity === 3){
            //日常表现 查询
            var id=info.rateId;
            var userid=info.ext.id;
            Rate.getcomment(id,userid,function(err,result){
                if(err){
                    res.json({success:-1,desc:"fail"})
                }else{
                    console.log(JSON.stringify(result))
                    res.json({success:0, desc:'success', data:result});
                }
            })
    }else{
          res.json({success:-1, desc:'identity is error', data:{}});
    }
});

router.post('/delete',function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.info)){
        return res.json({success:-1, desc:'no info', data:{}});
    }
    var info = req.body.info;
    if(util.isNumber(info.identity) === false){
        return res.json({success:-1, desc:'identity is error', data:{}});
    }
    if(util.isString(info.rateId) === false){
        return res.json({success:-1, desc:'info.rateId is not String', data:{}});
    }
    if(util.isString(info.id) === false){
        return res.json({success:-1, desc:'info.id is not String', data:{}});
    }
    if(info.identity === 2 && util.isString(info.sid) === false){
        return res.json({success:-1, desc:'info.sid is not String', data:{}});
    }
    if(info.identity !== 1 && info.identity !== 2){
        return res.json({success:-1, desc:'info.identity is error', data:{}});
    }
    if(info.identity === 1){
        Rate.deleteTeacherRate(req.body.corpId, info.rateId, info.id)
        .then(function(){
            return res.json({success:0, desc:'success', data:{}});
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    }else{
        Rate.deleteParentRate(req.body.corpId, info.id, info.sid, info.rateId)
        .then(function(){
            return res.json({success:0, desc:'success', data:{}});
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    }
});

router.post('/cancel',function(req, res, next){//撤销
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.info)){
        return res.json({success:-1, desc:'no info', data:{}});
    }
    var info = req.body.info;
    if(util.isNumber(info.identity) === false){
        return res.json({success:-1, desc:'identity is error', data:{}});
    }
    if(util.isString(info.rateId) === false){
        return res.json({success:-1, desc:'info.rateId is not String', data:{}});
    }
    // if(util.isString(info.id) === false){
    //     return res.json({success:-1, desc:"info.id is not String", data:{}});
    // }
    if(info.identity !== 1){
        return res.json({success:-1, desc:'info.identity is error', data:{}});
    }
    Rate.cancelRate(req.body.corpId, info.rateId).then(function(rate){//更新撤销状态
        if(rate=="1"){
            return Promise.reject(new Error('该条评语已经撤销'));
        }if(rate=="2"){
            return Promise.reject(new Error('教师不存在'));
        }
            return Rate.getAppid(req.body.corpId).then(function(appid){
                var MsgPromises = [];
                var api = Wechat.getCorpManager(req.body.corpId,appid)[appid];
                 rate.parent=["18304077397"]
                rate.parent.forEach(function(parent){
                     parent="18304077397|13610824661"
                        var message = {
                            to:{
                                touser:parent//这里是一个数组
                            },
                            msg:{
                                msgtype:'news',
                                news:{
                                    articles:[
                                        {
                                            title:'评语撤销',
                                            description:rate.teacherName + ':' + decodeURI(decodeURI(rate.content))
                                        }
                                    ]
                                }
                            },
                            safe:'0'
                        };
                        return MSG.sendMessage(
                            api,
                            message
                            );
                });
                return Promise.all(MsgPromises);
            });
    })
    .then(function(){
            return res.json({success:0, desc:'success', data:{}});
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

module.exports = router;