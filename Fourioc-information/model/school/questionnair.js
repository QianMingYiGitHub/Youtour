var util = require('util');
var Promise = require('promise');
//var db = require('../../api/mongodb');
// var Student = require('./student');
// var Parent = require('./parent');
// var Teacher = require('./teacher');
var school_parent = require('./school_parent');
var school_teacher = require('./school_teacher');
var school_student = require('./school_student');
var WxUser = require('../contact/wxUser');
var DB = require('../../model/DB');
var logger = require('../../api/logger').logger;
var questionnair_status = {//状态 0：草稿，1：已发布，2：已关闭
    draft: 0,
    published:1,
    closed:2
};

exports.questionnair_status = questionnair_status;
// var questionnairModel = {};
// var getQuestionnairModel = function(corpId){
//     var key = corpId + '.questionnair';
//     if(util.isNullOrUndefined(questionnairModel[key])){
//         questionnairModel[key] = db.createModel(key,{
//             createPerson:String,
//             info:{
//                 status:Number,//状态 0：草稿，1：已发布，2：已关闭
//                 questionNum:Number,//题目数
//                 title:String,//问卷标题
//                 summary:String,//问卷说明
//                 anonymous:Number,//是否匿名调查
//                 permission:Number,//是否允许参与者查看结果
//                 editTime:{type:Date, default:Date.now},//编辑时间
//                 endTime:Date,//截止日期
//                 userIds:[
//                     {
//                         userid:String,//用户id
//                         identity:Number,//身份，1：家长，2：教职工
//                         ext:String//当身份为家长时，赋值为sid
//                     }
//                 ],
//                 joinNum:{type:Number, default:0},//参与人数
//                 hideFromHistory:{type:Boolean, default:false}//从历史记录中隐藏
//             },
//             question:[
//                 {
//                     mode:Number,//1:单选，2：多选，3：问答
//                     isMust:Number,//0：选填，1：必填
//                     description:String,//问题描述
//                     optionMin:Number,//最少选择数
//                     optionMax:Number,//最多选择数
//                     optionList:[
//                         {
//                             optionName:String,
//                             isWrite:Number//0:不可写，1：可写
//                         }
//                     ]
//                 }
//             ]
//         });
//     }
//     return questionnairModel[key];
// };

// var joinerQuestionnairModel = {};
// var getJoinerQuestionnairModel = function(corpId){
//     var key = corpId + '.joiner_questionnair';
//     if(util.isNullOrUndefined(joinerQuestionnairModel[key])){
//         joinerQuestionnairModel[key] = db.createModel(key,{
//             questionnairId:String,//问卷调查id
//             userid:String,//用户id
//             identity:Number,//身份 1：家长，2：教职工
//             ext:String,//当身份为家长时，赋值为sid
//             hasRead:{type:Boolean, default:false},//是否已阅
//             hasAnswer:{type:Boolean, default:false},//是否已回答
//             hideFromHistory:{type:Boolean, default:false}
//         });
//     }
//     return joinerQuestionnairModel[key];
// };
// var joinerOptionModel = {};
// var getJoinerOptionModel = function(corpId){
//     var key = corpId + '.joiner_questionnair_option';
//     if(util.isNullOrUndefined(joinerOptionModel[key])){
//         joinerOptionModel[key] = db.createModel(key,{
//             questionnairId:String,
//             userid:String,
//             identity:Number,
//             ext:String,
//             questionid:String,
//             optionId:String,
//             saveTime:{type:Date, default:Date.now},
//             answer:String
//         });
//     }
//     return joinerOptionModel[key];
// }
// var joinerAnswerModel = {};
// var getJoinerAnswerModel = function(corpId){
//     var key = corpId + '.joiner_questionnair_answer';
//     if(util.isNullOrUndefined(joinerAnswerModel[key])){
//         joinerAnswerModel[key] = db.createModel(key,{
//             questionnairId:String,
//             userid:String,
//             identity:Number,
//             ext:String,
//             question:[
//                 {
//                     id:String,//题目id
//                     mode:Number,//1：单选，2：多选，3：问答
//                     description:String,//问题描述
//                     optionList:[
//                         {
//                             id:String,//选项的id
//                             optionName:String,//选项内容
//                             isWrite:Number,//是否为可写内容
//                             writeContent:String//填写的内容，不可写为空字符串
//                         }
//                     ]
//                 }
//             ]
//         });
//     }
//     return joinerAnswerModel[key];
// }

exports.deleteQuestionnairOfCreator = function(corpId, questionnairId){
    // var questionnairMdl = getQuestionnairModel(corpId);
    return new Promise(function(resolve, reject){
        DB.updateById(corpId, 'questionnair', questionnairId, {'$set':{'info.hideFromHistory' : true}},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};
exports.deleteQuestionnairOfJoiner = function(corpId, questionnairId, joiner, identity, ext){
    // var joinerQuestionnairMdl = getJoinerQuestionnairModel(corpId);
    return new Promise(function(resolve, reject){
        DB.updateData(corpId,'joiner_questionnair',{questionnairId:questionnairId,
            userid:joiner,
            identity:identity,
            ext:ext}, {'$set':{hideFromHistory:true}}, function(err){
                if(err){
                    return reject(err);
                }
                return resolve();
            });
    });
};

exports.isQuestionnairCanPublish = function(corpId, questionnairid){
    if(util.isNullOrUndefined(questionnairid) || questionnairid === ''){
        return Promise.resolve(true);
    }
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'questionnair', {_id:questionnairid}, function(err, data){
            if(err){
                return reject(err);
            }
            if(util.isNullOrUndefined(data)){
                return resolve(true);
            }
            if(data.info.status === 0){
                return resolve(true);
            }
            return resolve(false);
        });
    });
};

exports.saveQuestionnair = function(corpId, questionnair){
    return new Promise(function(resolve, reject){
        var tmpquestionnair = {};
        tmpquestionnair.info = Object.assign({},questionnair.info);
        tmpquestionnair.createPerson = questionnair.createPerson;
        tmpquestionnair.question = Array.from(questionnair.question);
        if(util.isNullOrUndefined(tmpquestionnair.info.id) === false){
            delete tmpquestionnair.info.id;
        }
        var id = questionnair.info.id;
        if(util.isNullOrUndefined(id) || id === ''){
            DB.save(corpId, 'questionnair', tmpquestionnair, function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        }else{
            tmpquestionnair.info.editTime = Date.now();
            DB.updateById(corpId, 'questionnair', id, {'$set':tmpquestionnair}, function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        }
    });
};

function getQuestionnair(corpId, questionnairid){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'questionnair', {_id:questionnairid}, function(err, data){
            if(err){
                return reject(err);
            }
            if(util.isNullOrUndefined(data)){
                return reject(new Error('questionnairId:' + questionnairid + ', isnot in db'));
            }
            var tt = data.toJSON();
            var questionnair = {};
            questionnair.createPerson = {id:tt.createPerson};
            questionnair.info = tt.info;
            questionnair.question = Array.from(tt.question);
            questionnair.info.id = questionnairid;
            return resolve(questionnair);
        });
    }).then(function(questionnair){
        return school_teacher.getTeacherAllInfoByUserId(corpId,questionnair.createPerson.id).then(function(user){
            questionnair.createPerson.name = user.teacherName;
            questionnair.createPerson.headPic = user.weixin.avatar;
            return Promise.resolve(questionnair);
        });
    }).then(function(questionnair){
        var promises = [];
        questionnair.info.userIds.forEach(function(user){
            if(user.identity === 1){
                promises.push(school_parent.getParentAllInfoByUserIdAndSid(corpId, user.userid,user.ext).then(function(info){
                    user.name = info.nickName;
                    user.headPic = info.avatar;
                }));
            }else if(user.identity === 2){
                promises.push(school_teacher.getTeacherAllInfoByUserId(corpId, user.userid).then(function(info){
                    user.name = info.teacherName;
                    user.headPic = info.weixin.avatar;
                }));
            }
        });
        return Promise.all(promises).then(function(){
            return Promise.resolve(questionnair);
        });
    });
}

exports.getQuestionnair = getQuestionnair;

exports.getQuestionnairsOfCreator = function(corpId, userid, status){
    return new Promise(function(resolve, reject){
        var condition = {createPerson:userid};
        switch(parseInt(status)) {
        case questionnair_status.draft:
            condition['info.status'] = status;
            break;
        case questionnair_status.published:
            condition['info.status'] = status;
            condition['info.endTime'] = {'$gte': new Date()};
            break;
        case questionnair_status.closed:
            condition['$or'] = [
                {'info.status': status},
                {'info.endTime': {'$lt': new Date()}}
            ];
            break;
        }
        DB.find(corpId, 'questionnair',condition,{},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    }).then(function(questionnairs){
        var promises = [];
        var questionnairList = [];
        questionnairs.forEach(function(questionnair){
            var tmp = {};
            tmp.id = questionnair._id.toString();
            tmp.title = questionnair.info.title;
            tmp.summary = questionnair.info.summary;
            tmp.createPerson = questionnair.createPerson;
            tmp.status = questionnair.info.status;
            tmp.isTimeout = Date.now() > questionnair.endTime;
            tmp.identity = 3;
            tmp.ext = '';
            tmp.editTime = questionnair.info.editTime;
            tmp.pics = questionnair.info.pics;
            questionnairList.push(tmp);
            promises.push(school_teacher.getTeacherAllInfoByUserId(corpId, tmp.createPerson).then(function(user){
                tmp.personName = user.teacherName;
                tmp.headPic = user.weixin.avatar;
            }));
        });
        return Promise.all(promises).then(function(){
            return Promise.resolve(questionnairList);
        });
    });
};

exports.getQuestionnairOfJoiner = function(corpId, userid, hasAnswer){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'joiner_questionnair',{userid:userid,hasAnswer:hasAnswer}, {},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    }).then(function(joinQuestionnairs){
        var promises = [];
        var questionnairList = [];
        joinQuestionnairs.forEach(function(joinQuestionnair){
            promises.push(getQuestionnair(corpId,joinQuestionnair.questionnairId).then(function(questionnair){
                var tmp = {};
                tmp.id = joinQuestionnair.questionnairId;
                tmp.title = questionnair.info.title;
                tmp.summary = questionnair.info.summary;
                tmp.createPerson = questionnair.createPerson.id;
                tmp.status = questionnair.info.status;
                tmp.isTimeout = Date.now() > questionnair.endTime;
                tmp.identity = joinQuestionnair.identity;
                tmp.ext = joinQuestionnair.ext;
                tmp.editTime = questionnair.editTime;
                questionnairList.push(tmp);
                    
                return school_teacher.getTeacherAllInfoByUserId(corpId, tmp.createPerson).then(function(user){
                    tmp.personName = user.teacherName;
                    tmp.headPic = user.weixin.avatar;
                });
            }));
        });
        return Promise.all(promises).then(function(){
            return Promise.resolve(questionnairList);
        });
    });
};

exports.closeQuestionnair = function(corpId, questionnairId){
    // var questionnairMdl = getQuestionnairModel(corpId);
    return new Promise(function(resolve, reject){
        DB.updateById(corpId,'questionnair',questionnairId,{'$set':{'info.status':2}}, function(err,result){
            logger.info('closeQuestionnair.result = ' + JSON.stringify(result));
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.increaseQuestionnairJoinNum = function(corpId, questionnairId){
    return new Promise(function(resolve, reject){
        DB.updateById(corpId, 'questionnair', questionnairId,{'$inc':{'info.joinNum':1}}, function(err,result){
            logger.info('increaseQuestionnairJoinNum : id['+questionnairId+'].result = ' + JSON.stringify(result));
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.saveJoinerQuestionnair = function(corpId, joinerQuestionnair){
    if(util.isArray(joinerQuestionnair)){
        var promises = [];
        joinerQuestionnair.forEach(function(questionnair){
            promises.push(new Promise(function(resolve, reject){
                DB.save(corpId, 'joiner_questionnair', questionnair, function(err, data){
                    if(err){
                        return reject(err);
                    }
                    return resolve(data);
                });
            }));
        });
        return Promise.all(promises);
    }else{
        return new Promise(function(resolve, reject){
            DB.save(corpId, 'joiner_questionnair', joinerQuestionnair, function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
};

exports.joinerReadQuestionnair = function(corpId, questionnairId, userid, identity, ext){
    return new Promise(function(resolve, reject){
        logger.info('joinerReadQuestionnair = ' + JSON.stringify({
            corpId:corpId,
            questionnairId:questionnairId,
            userid:userid,
            identity:identity,
            ext:ext
        }));
        DB.update(corpId, 'joiner_questionnair', {questionnairId:questionnairId,userid:userid, identity:identity, ext:ext}, {'$set':{hasRead:true}}, function(err,result){
            logger.info('joinerReadQuestionnair.result = ' + JSON.stringify(result));
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.isJoinerHasRead = function(corpId, joiner){
    return new Promise(function(resolve, reject){
        /**
         * questionnairId:String,//问卷调查id
            userid:String,//用户id
            identity:Number,//身份 1：家长，2：教职工
            ext:String,//当身份为家长时，赋值为sid
         */
        DB.findOne(corpId, 'joiner_questionnair', {questionnairId:joiner.questionnairId, userid:joiner.userid, identity:joiner.identity,ext:joiner.ext},function(err, data){
            if(err){
                return reject(err);
            }
            if(util.isNullOrUndefined(data)){
                return reject(new Error('no data'));
            }
            return resolve(data.hasRead);
        });
    });
};

exports.isJoinerHasAnswerd = function(corpId, joiner){
    return new Promise(function(resolve, reject){
        /**
         * questionnairId:String,//问卷调查id
            userid:String,//用户id
            identity:Number,//身份 1：家长，2：教职工
            ext:String,//当身份为家长时，赋值为sid
         */
        DB.findOne(corpId, 'joiner_questionnair', {questionnairId:joiner.questionnairId, userid:joiner.userid, identity:joiner.identity,ext:joiner.ext},function(err, data){
            if(err){
                return reject(err);
            }
            if(util.isNullOrUndefined(data)){
                return resolve(false);
            }
            return resolve(data.hasAnswer);
        });
    });
};

exports.saveAnswer = function(corpId, answer){
    logger.info('saveAnswer.answer = ' + JSON.stringify(answer));
    return new Promise(function(resolve, reject){
        DB.save(corpId,'joiner_questionnair_answer',answer, function(err,data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    }).then(function(dd){
        var options = [];
        dd.question.forEach(function(question){
            question.optionList.forEach(function(option){
                var tmp = {};
                tmp.questionnairId = dd.questionnairId;
                tmp.userid = dd.userid;
                tmp.identity = dd.identity;
                tmp.ext = dd.ext;
                tmp.questionid = question.id;
                tmp.optionId = option.id;
                tmp.answer = option.writeContent;
                options.push(new Promise(function(resolve, reject){
                    DB.save(corpId, 'joiner_questionnair_option', tmp, function(err, result){
                        if(err){
                            return reject(err);
                        }
                        return resolve(dd);
                    });
                }));
            });
        });
        return Promise.all(options);
    }).then(function(data){
        return new Promise(function(resolve, reject){
            DB.updateData(corpId,'joiner_questionnair',{questionnairId:answer.questionnairId, userid:answer.userid, identity:answer.identity,ext:answer.ext},{'$set':{hasAnswer:true}},function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve();
            });
        }).then(function(){
            return Promise.resolve(data);
        });
    });
};

exports.getAnswer = function(corpId, joiner){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId,'joiner_questionnair_answer',joiner, function(err,data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.getAnswerResult = function(corpId, questionnairid){
    var question = [];
    return new Promise(function(resolve, reject){//查找问卷调查详细信息
        DB.findOne(corpId,'questionnair',{_id:questionnairid},function(err,data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    }).then(function(questionnair){
        var promises = [];
        questionnair.question.forEach(function(qq){//记录每个问题
            var tmp = {};
            tmp.id = qq._id;
            tmp.mode = qq.mode;
            tmp.isMust = qq.isMust;
            tmp.description = qq.description;
            tmp.pics = qq.pics;
            tmp.optionList = [];
            question.push(tmp);
            var question_joiner_num = 0;
            promises.push(new Promise(function(resolve, reject){
                DB.count(corpId,'joiner_questionnair_option',{questionnairId:questionnair._id, questionid:qq._id},function(err, count){
                    if(err){
                        return reject(err);
                    }
                    question_joiner_num = count;
                    return resolve();
                });
            }).then(function(){
                var option_promises = [];
                qq.optionList.forEach(function(oo){//记录每个选项
                    var tmpop = {};
                    tmpop.id = oo._id;
                    tmpop.optionName = oo.optionName;
                    tmpop.answerNum = 0;
                    tmpop.percent = 0;
                    tmpop.person = [];
                    tmp.optionList.push(tmpop);
                    var query = {questionnairId:questionnair._id, questionid:qq._id,optionId:oo._id};
                    option_promises.push(new Promise(function(resolve, reject){
                        DB.find(corpId,'joiner_questionnair_option',query,{}, function(err, options){
                            if(err){
                                return reject(err);
                            }
                            return resolve(options);
                        });
                    }).then(function(options){
                        tmpop.answerNum = options.length;
                        tmpop.percent = question_joiner_num === 0 ? 0: tmpop.answerNum/question_joiner_num;
                        var person_promises = [];
                        options.forEach(function(option){
                            var tmpperson = {};
                            tmpperson.userid = option.userid;
                            tmpperson.identity = option.identity;
                            tmpperson.ext = option.ext;
                            tmpperson.answerTime = option.saveTime;
                            tmpperson.answer = option.answer;
                            tmpop.person.push(tmpperson);
                            if(tmpperson.identity === 1){
                                person_promises.push(school_parent.getParentAllInfoByUserIdAndSid(corpId, option.userid,option.ext).then(function(info){
                                    tmpperson.name = info.nickName;
                                    tmpperson.headPic = info.avatar;
                                }));
                            }else if(tmpperson.identity === 2){
                                person_promises.push(school_teacher.getTeacherAllInfoByUserId(corpId, option.userid).then(function(info){
                                    tmpperson.name = info.teacherName;
                                    tmpperson.headPic = info.weixin.avatar;
                                }));
                            }
                        });
                        return Promise.all(person_promises);
                    }));
                });
                return Promise.all(option_promises);
            }));
        });
        return Promise.all(promises);
    }).then(function(){
        return Promise.resolve(question);
    });
};
