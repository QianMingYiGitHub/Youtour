var express = require('express');
var router = express.Router();
var Promise = require('promise');
var base_config = require('../../api/config');
var homeworkMdl = require('../../model/school/homework');
var school_teacher = require('../../model/school/school_teacher');
var school_parent = require('../../model/school/school_parent');
var school_student = require('../../model/school/school_student');
var WxUser = require('../../model/contact/wxUser');
var MSG = require('../../api/msg.js');
var Wechat = require('../../api/wechat');
var util = require('util');
var Questionnair = require('../../model/school/questionnair');
var AppType = require('../../api/apptype');
//var Corps = require('../../model/corp');
var appType = require('../../api/apptype');
//var corpLib = require('../../library/corp/index');
var logger = require('../../api/logger').logger;

router.post('/save', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.info)){
        return res.json({success:-1, desc:'no info', data:{}});
    }
    if(util.isNullOrUndefined(req.body.question)){
        return res.json({success:-1, desc:'no question', data:{}});
    }
    var canPublished = false;
    corpLib.getAppid(req.body.corpId, appType.getAppType('questionnair'))
    .then(function(appid){
        //判断问卷调查是否可发布
        Questionnair.isQuestionnairCanPublish(req.body.corpId, req.body.info.id).then(function(result){
            canPublished = result;
        }).then(function(){
            //保存问卷调查
            return Questionnair.saveQuestionnair(req.body.corpId, {createPerson:req.body.createPerson,info:req.body.info, question:req.body.question});
        })
        .then(function(data){
            res.json({success:0, desc:'success', data:{}});
            //问卷调查可发布，需要微信通知参与者
            if(data.info.status === 1 && canPublished){
                var joinerQuestionnairs = [];
                data.info.userIds.forEach(function(user){
                    var joinerQuestionnair = {
                        questionnairId:data._id,
                        userid:user.userid,
                        identity:user.identity,
                        ext:user.ext
                    };
                    joinerQuestionnairs.push(joinerQuestionnair);
                    // Questionnair.saveJoinerQuestionnair(req.body.corpId,joinerQuestionnair);
                });
                //保存参与者的问卷调查信息
                return Questionnair.saveJoinerQuestionnair(req.body.corpId,joinerQuestionnairs).then(function(datas){
                    //发送通知
                    var api = Wechat.getCorpManager(req.body.corpId,appid)[appid];
                    //取得创建者个人信息
                    school_teacher.getTeacherAllInfoByUserId(req.body.corpId, req.body.createPerson)
                    .then(function(user){
                        var users = {};
                        var frominfo = ',您好！您有一份来自['+user.teacherName + ']的问卷调查，请查阅！';
                        var description = decodeURI(decodeURI(req.body.info.title)) + '\n' + decodeURI(decodeURI(req.body.info.summary));
                        var promises = [];
                        //循环所有的参与者的问卷信息
                        datas.forEach(function(questionnair){
                            promises.push(Promise.resolve().then(function(){
                                if(questionnair.identity === 1){//如果身份是家长
                                    return school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, questionnair.userid,questionnair.ext).then(function(info){
                                        return Promise.resolve({wxuser:info.wxuser,identity: 1, userid: info.userid,name: info.nickName, ext: questionnair.ext});
                                    });
                                }
                                else if(questionnair.identity === 2){//身份是老师
                                    return school_teacher.getTeacherAllInfoByUserId(req.body.corpId, questionnair.userid).then(function(info){
                                        return Promise.resolve({wxuser:info.weixin.userid, identity:2, userid:info.userid,name: info.teacherName,ext: questionnair.ext});
                                    });
                                }
                            }).then(function(info){
                                var article = {
                                    title:'',
                                    description:description
                                };
                                var message = null;
                                if(util.isNullOrUndefined(users[info.wxuser])){
                                    message = {
                                        to:{
                                            touser:info.wxuser
                                        },
                                        msg:{
                                            msgtype:'news',
                                            news:{
                                                articles:[
                                                ]
                                            }
                                        },
                                        safe:'0'
                                    };
                                }else{
                                    message = users[info.wxuser];
                                }
                                message.msg.news.articles.push(article);
                                users[info.wxuser] = message;
                                var url = 'http://' + base_config.getURL()+'/questionnair/read_questionnair?type=3&corp_id='+req.body.corpId+ '&user_id=' + info.userid + '&appid='+appid + '&identity=' + info.identity + '&ext='+info.ext + '&questionnaire_id=' + questionnair.questionnairId;//api.getAuthorizeURL(,'youtour-wo');
                                article.url = url;
                                article.title = info.name + frominfo;
                            }));
                        });
                        return Promise.all(promises).then(function(){
                            if(appid){
                                for(var key in users){
                                    MSG.sendMessage( api, users[key] );
                                }
                            }
                        });
                    });
                    console.log('需要发送问卷调查通知');
                });
            }
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/close', function(req, res, next){
    logger.info('/questionnair/close.body = ' + JSON.stringify(req.body));
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no info', data:{}});
    }
    if(util.isNullOrUndefined(req.body.questionnairId)){
        return res.json({success:-1, desc:'no questionnairId', data:{}});
    }
    corpLib.getAppid(req.body.corpId, appType.getAppType('questionnair'))
    .then(function(appid){
        var api = Wechat.getCorpManager(req.body.corpId,appid)[appid];
        return Questionnair.getQuestionnair(req.body.corpId, req.body.questionnairId).then(function(questionnair){
            logger.info('Questionnair.getQuestionnair.result = ' + JSON.stringify(questionnair));
            if(questionnair.createPerson.id !== req.body.userid){
                return Promise.reject(new Error('您不能关闭其他人发布的问卷'));
            }
                    //取得创建者个人信息
            return school_teacher.getTeacherAllInfoByUserId(req.body.corpId, req.body.userid)
            .then(function(user) {
                return Promise.resolve(questionnair.info.userIds.map(function(user) {
                    return {
                        to:{
                            touser:user.userid
                        },
                        msg:{
                            msgtype:'news',
                            news:{
                                articles:[
                                    {
                                        title:decodeURI(decodeURI(questionnair.info.title)),
                                        description:'来自于[' + req.session.teacher.name + ']的问卷调查，已关闭。请了解！',
                                        url:'http://' + base_config.getURL()+'/questionnair/read_questionnair?type=3&corp_id='+req.body.corpId+ '&user_id=' + user.userid + '&appid='+appid + '&identity=' + user.identity + '&ext='+user.ext + '&questionnaire_id=' + req.body.questionnairId//api.getAuthorizeURL(,'youtour-wo')
                                    }
                                ]
                            }
                        },
                        safe:'0'
                    };
                }));
            });
        }).then(function(messages){
            return Questionnair.closeQuestionnair(req.body.corpId, req.body.questionnairId).then(function(){
                return Promise.all(messages.map(function(message) {
                    return MSG.sendMessage(api, message);
                }));
            });
        }).then(function(){
            return res.json({success:0, desc:'success', data:{}});
        });
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/get', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no userid', data:{}});
    }
    if(util.isNullOrUndefined(req.body.identity)){
        return res.json({success:-1, desc:'no identity', data:{}});
    }
    if(util.isNullOrUndefined(req.body.questionnairId)){
        return res.json({success:-1, desc:'no questionnairId', data:{}});
    }
    if(util.isNumber(req.body.identity) === false){
        return res.json({success:-1, desc:'identity isnot number', data:{}});
    }
    Questionnair.getQuestionnair(req.body.corpId, req.body.questionnairId).then(function(questionnair){
        return res.json({success:0, desc:'success', data:{questionnair:questionnair}});
    }).then(function(){
        if(req.body.identity !== 3){//不是创建者，需要更新阅读状态
            return Questionnair.joinerReadQuestionnair(req.body.corpId,req.body.questionnairId, req.body.userid, req.body.identity, req.body.ext);
        }
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/delete', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no info', data:{}});
    }
    if(util.isNullOrUndefined(req.body.questionnairId)){
        return res.json({success:-1, desc:'no questionnairId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.identity)){
        return res.json({success:-1, desc:'no identity', data:{}});
    }
    if(util.isNumber(req.body.identity) === false){
        return res.json({success:-1, desc:'identity isnot number', data:{}});
    }
    if(req.body.identity < 0 || req.body.identity > 3){
        return res.json({success:-1, desc:'identity invalid', data:{}});
    }
    if(req.body.identity === 3){
        Questionnair.deleteQuestionnairOfCreator(req.body.corpId,req.body.questionnairId).then(function(){
            return res.json({success:0, desc:'success', data:{}});
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    }else{
        Questionnair.deleteQuestionnairOfJoiner(req.body.corpId,req.body.questionnairId,req.body.userid,req.body.identity,req.body.ext).then(function(){
            return res.json({success:0, desc:'success', data:{}});
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    }
});

router.post('/notify', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no userid', data:{}});
    }
    if(util.isNullOrUndefined(req.body.questionnairId))
    {
        return res.json({success:-1, desc:'no questionnairId', data:{}});
    }
    corpLib.getAppid(req.body.corpId, appType.getAppType('questionnair'))
    .then(function(appid){
        Questionnair.getQuestionnair(req.body.corpId, req.body.questionnairId).then(function(questionnair){
            if(questionnair.info.status === 0){
                return Promise.reject(new Error('该问卷调查状态为草稿，不能通知参与人'));
            }else if(questionnair.info.status === 2){
                return Promise.reject(new Error('该问卷调查已关闭，不能通知参与人'));
            }

            //发送通知
            var api = Wechat.getCorpManager(req.body.corpId,appid)[appid];
            return school_teacher.getTeacherAllInfoByUserId(req.body.corpId, questionnair.createPerson.id).then(function(user){
                var users = {};
                var frominfo = ',您好！您有一份来自['+user.teacherName + ']的问卷调查，请查阅！';
                var description = decodeURI(decodeURI(questionnair.info.title)) + '\n' + decodeURI(decodeURI(questionnair.info.summary));
                var promises = [];
                questionnair.info.userIds.forEach(function(join_user){
                    promises.push(Promise.resolve().then(function(){
                        if(join_user.identity === 1){
                            return school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, join_user.userid,join_user.ext).then(function(info){
                                return Promise.resolve({wxuser:info.wxuser, name:info.nickName});
                            });
                        }else{
                            return school_teacher.getTeacherAllInfoByUserId(req.body.corpId, join_user.userid).then(function(info){
                                return Promise.resolve({wxuser:info.weixin.userid, name:info.teacherName});
                            });
                        }
                    }).then(function(info){
                        return Questionnair.isJoinerHasAnswerd(req.body.corpId,{questionnairId:req.body.questionnairId, userid:join_user.userid,identity:join_user.identity,ext:join_user.ext}).then(function(isJoined){
                            if(isJoined === false){
                                var article = {
                                    title:'',
                                    description:description
                                };
                                var message = null;
                                if(util.isNullOrUndefined(users[info.wxuser])){
                                    message = {
                                        to:{
                                            touser:info.wxuser
                                        },
                                        msg:{
                                            msgtype:'news',
                                            news:{
                                                articles:[
                                                ]
                                            }
                                        },
                                        safe:'0'
                                    };
                                }else{
                                    message = users[info.wxuser];
                                }
                                message.msg.news.articles.push(article);
                                users[info.wxuser] = message;
                                var url = 'http://' + base_config.getURL()+'/questionnair/read_questionnair?type=3&corp_id='+req.body.corpId+ '&user_id=' + join_user.userid + '&appid='+req.session.appid + '&identity=' + join_user.identity + '&ext='+join_user.ext + '&questionnaire_id=' + req.body.questionnairId;//api.getAuthorizeURL(,'youtour-wo');
                                article.url = url;
                                article.title = info.name + frominfo;
                            }
                        });
                    }));
                });
                return Promise.all(promises).then(function(){
                    if(appid){
                        for(var key in users){
                            MSG.sendMessage( api, users[key] );
                        }
                    }
                });
            });

        }).then(function(){
            return res.json({success:0, desc:'success', data:{}});
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
    })
    .catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/list', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no userid', data:{}});
    }
    if(util.isNullOrUndefined(req.body.status)){
        return res.json({success:-1, desc:'no status', data:{}});
    }
    switch(req.body.status){
    case 0:
    case 1:
    case 2:
        Questionnair.getQuestionnairsOfCreator(req.body.corpId, req.body.userid, req.body.status).then(function(questionnairs){
            return res.json({success:0, desc:'success', data:{questionnairList:questionnairs}});
        }).catch(function(err){
            return res.json({success:-1, desc:err.message, data:{}});
        });
        break;
    case 3:
    case 4:
        {
            Questionnair.getQuestionnairOfJoiner(req.body.corpId, req.body.userid, req.body.status===3? false:true).then(function(questionnairs){
                return res.json({success:0, desc:'success', data:{questionnairList:questionnairs}});
            }).catch(function(err){
                return res.json({success:-1, desc:err.message, data:{}});
            });
        }
        break;
    default:
        res.json({success:-1, desc:'status is invalid', data:{}});
    }
});

router.post('/info', function(req, res, next){
    logger.info('/questionnair/info.body = ' + JSON.stringify(req.body));
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no info', data:{}});
    }
    if(util.isNullOrUndefined(req.body.questionnairId)){
        return res.json({success:-1, desc:'no questionnairId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.identity)){
        return res.json({success:-1, desc:'no identity', data:{}});
    }
    var result = {};
    var person_character = [];
    var joiner = null;

    Questionnair.getQuestionnair(req.body.corpId, req.body.questionnairId).then(function(questionnair){
        result.createPerson = questionnair.createPerson;
        result.editTime = questionnair.editTime;
        result.questionnairId = questionnair._id;
        result.title = questionnair.info.title;
        result.summary = questionnair.info.summary;
        result.anonymous = questionnair.info.anonymous;
        result.permission = questionnair.info.permission;
        result.endTime = questionnair.info.endTime;
        result.questionNum = questionnair.info.questionNum;
        result.status = questionnair.info.status;
        result.pics = questionnair.info.pics;
        result.isTimeOut = (Date.now() > questionnair.info.endTime) ? true : false;
        result.isCreator = req.body.userid === result.createPerson.id;
        result.isJoiner = false;
        result.isAnswered = false;
        result.joinNum = questionnair.info.joinNum;
        result.users = [];

        questionnair.info.userIds.forEach(function(user){
            var tmp = {};
            tmp.userid = user.userid;
            tmp.identity = user.identity;
            tmp.ext = user.ext;
            if(result.isJoiner === false){
                if(user.userid === req.body.userid){
                    result.isJoiner = true;
                }
            }
            result.users.push(tmp);
        });
        return school_teacher.getTeacherAllInfoByUserId(req.body.corpId, questionnair.createPerson.id);
    }).then(function(info){//获取创建者名称和头像
        result.name = info.teacherName;
        result.headPic = info.weixin.avatar;
    }).then(function(){//【判断参与者是否答题
        if(result.isJoiner){
            var joiner = {questionnairId:req.body.questionnairId,userid:req.body.userid, identity:req.body.identity,ext:req.body.ext};
            return Questionnair.isJoinerHasAnswerd(req.body.corpId,joiner).then(function(isAnswered){
                result.isAnswered = isAnswered;
            });
        }
    }).then(function(){
        var promises = [];
        result.users.forEach(function(user){
            if(user.identity === 2){//用户是教职工
                promises.push(school_teacher.getTeacherAllInfoByUserId(req.body.corpId, user.userid).then(function(info){
                    user.name = info.teacherName;
                    user.headPic = info.weixin.avatar;
                }));
            }else if(user.identity === 1){//用户是家长
                promises.push(school_parent.getParentAllInfoByUserIdAndSid(req.body.corpId, user.userid, user.ext).then(function(info){
                    user.name = info.nickName;
                    user.headPic = info.avatar;
                }));
            }
        });
        return Promise.all(promises);
    }).then(function(){
        return res.json({success:0, desc:'success', data:result});
    }).then(function(){
        if(req.body.identity !== 3){//不是创建者，需要更新阅读状态
            return Questionnair.joinerReadQuestionnair(req.body.corpId,req.body.questionnairId, req.body.userid, req.body.identity, req.body.ext);
        }
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/question/get', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.questionnairId)){
        return res.json({success:-1, desc:'no questionnairId', data:{}});
    }
    var question = [];
    Questionnair.getQuestionnair(req.body.corpId, req.body.questionnairId).then(function(questionnair){
        questionnair.question.forEach(function(qq){
            var tmp = {};
            tmp.id = qq._id;
            tmp.mode = qq.mode;
            tmp.isMust = qq.isMust;
            tmp.description = qq.description;
            tmp.pics = qq.pics;
            tmp.optionMin = qq.optionMin;
            tmp.optionMax = qq.optionMax;
            tmp.optionList = [];
            qq.optionList.forEach(function(option){
                var tmpoption = {};
                tmpoption.id = option._id;
                tmpoption.optionName = option.optionName;
                tmpoption.isWrite = option.isWrite;
                tmp.optionList.push(tmpoption);
            });
            question.push(tmp);
        });
        return res.json({success:0, desc:'success', data:{question:question}});
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/question/save', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.questionnair)){
        return res.json({success:-1, desc:'no questionnairId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no userid', data:{}});
    }
    if(util.isNullOrUndefined(req.body.identity)){
        return res.json({success:-1, desc:'no identity', data:{}});
    }
    if(util.identity === 1){
        if(util.isNullOrUndefined(req.body.ext)){
            return res.json({success:-1, desc:'no ext', data:{}});
        }
    }
    var joiner = {questionnairId: req.body.questionnair.id, userid:req.body.userid, identity:req.body.identity,ext:req.body.ext};
    Questionnair.isJoinerHasAnswerd(req.body.corpId,joiner).then(function(hasAnswer){
        if(hasAnswer){
            return Promise.reject(new Error('不能重复提交问卷答案'));
        }
    }).then(function(){
        var answer = {
            questionnairId:req.body.questionnair.id,
            userid:req.body.userid,
            identity:req.body.identity,
            ext:req.body.ext||'',
            question:req.body.questionnair.question
        };
        return Questionnair.saveAnswer(req.body.corpId,answer);
    }).then(function(){
        return res.json({success:0, desc:'success', data:{}});
    }).then(function(){
        logger.info('/question/save.increaseQuestionnairJoinNum.body = ' + JSON.stringify(req.body));
        return Questionnair.increaseQuestionnairJoinNum(req.body.corpId,req.body.questionnair.id);
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/myquestion/get', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.questionnairId)){
        return res.json({success:-1, desc:'no questionnairId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no userid', data:{}});
    }
    if(util.isNullOrUndefined(req.body.identity)){
        return res.json({success:-1, desc:'no identity', data:{}});
    }
    if(req.body.identity === 1){
        if(util.isNullOrUndefined(req.body.ext)){
            return res.json({success:-1, desc:'no ext', data:{}});
        }
    }
    var answer = {
        questionnairId:req.body.questionnairId,
        userid:req.body.userid,
        identity:req.body.identity,
        ext:req.body.ext||''
    };
    Questionnair.getAnswer(req.body.corpId,answer).then(function(data){
        if(util.isNullOrUndefined(data)){
            return res.json({success:-1, desc:'no answer', data:{}});
        }else{
            return res.json({success:0, desc:'success', data:{questionnair:{question:data.question}}});
        }
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});

router.post('/result', function(req, res, next){
    if(util.isNullOrUndefined(req.body)){
        return res.json({success:-1, desc:'no body', data:{}});
    }
    if(util.isNullOrUndefined(req.body.corpId)){
        return res.json({success:-1, desc:'no corpId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.questionnairId)){
        return res.json({success:-1, desc:'no questionnairId', data:{}});
    }
    if(util.isNullOrUndefined(req.body.userid)){
        return res.json({success:-1, desc:'no userid', data:{}});
    }
    if(util.isNullOrUndefined(req.body.identity)){
        return res.json({success:-1, desc:'no identity', data:{}});
    }
    if(util.identity === 1){
        if(util.isNullOrUndefined(req.body.ext)){
            return res.json({success:-1, desc:'no ext', data:{}});
        }
    }
    Questionnair.getAnswerResult(req.body.corpId,req.body.questionnairId).then(function(question){
        return res.json({success:0, desc:'success', data:{quesiton:question}});
    }).catch(function(err){
        return res.json({success:-1, desc:err.message, data:{}});
    });
});
module.exports = router;
