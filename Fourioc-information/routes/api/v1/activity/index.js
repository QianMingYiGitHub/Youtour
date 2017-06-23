var express = require('express');
var router = express.Router();
var util = require('util');
var Promise = require('promise');
// var userSvc = require('../../../../service/user');
// var departmentSvc = require('../../../../service/department');
// var wxContactSvc = require('../../../../service/wxcontact');
// var rateSvc = require('../../../../service/rate');
// var activitySvc = require('../../../../service/activity');
var async = require('async');
var logger = require('../../../../api/logger').logger;

router.post('/save', function (req, res, next) {
    return activitySvc.saveActivityOfCreator(req.body.corpId, req.body.activity).then(function (result) {
        if (result.state === activitySvc.creator_state.published) {
            var persons = result.leader.concat(result.partner);
            async.each(persons, function(person, cb){
                activitySvc.saveActivityOfJoiner(req.body.corpId, person, result._id).then(function(){
                    cb();
                }).catch(function(err){
                    logger.error(JSON.stringify({
                        service:'api.v1.activity.save',
                        err:err.message
                    }));
                    cb(err);
                });
            }, function(err){
                if(err){
                    logger.error(JSON.stringify({
                        service:'api.v1.activity.save',
                        err:err.message
                    }));
                }
                activitySvc.notifyNoRead(req.body.corpId, result._id).catch(function(err){
                    logger.error(JSON.stringify({
                        service:'api.v1.activity.save',
                        err:err.message
                    }));
                });
            });
        }
        res.json({
            success: 0,
            desc: 'success',
            data: {}
        });
    }).catch(function (err) {
        return res.json({
            success: -1,
            desc: err.message,
            data: {}
        });
    });
});

router.post('/close', function (req, res, next) {
    return activitySvc.closeActivity(req.body.corpId, req.body.id, req.body.reason).then(function (result) {
        res.json({
            success: 0,
            desc: 'success',
            data: {}
        });
        activitySvc.notifyClose(req.body.corpId, req.body.id);
    }).catch(function (err) {
        return res.json({
            success: -1,
            desc: err.message,
            data: {}
        });
    });
});

router.post('/get', function (req, res, next) {
    var kind = parseInt(req.body.type);
    switch(kind){
    case 0:
    case 1:
    case 2:
        activitySvc.getActivitiesOfCreator(req.body.corpId, req.body.userid, kind).then(function(results){
            res.json({
                success: 0,
                desc:'success',
                data:{
                    activity:results.map(function(elem){
                        return {
                            createPerson:elem.createPerson._id,//创建者id
                            personName:elem.createPerson.name,//创建者名称,
                            headPic:elem.createPerson.avatar,//创建者头像
                            id:elem._id,//活动id,
                            title:elem.title,//活动标题
                            editTime:elem.editTime//最后编辑时间
                        };
                    })
                }
            });
        }).catch(function(err){
            res.json({
                success:-1,
                desc:err.message,
                data:{}
            });
        });
        break;
    case 3:
    case 4:
        activitySvc.getActivitiesOfJoiner(req.body.corpId, req.body.userid, kind-3).then(function(results){
            res.json({
                success: 0,
                desc:'success',
                data:{
                    activity:results.map(function(elem){
                        return {
                            createPerson:elem.activity.createPerson._id,//创建者id
                            personName:elem.activity.createPerson.name,//创建者名称,
                            headPic:elem.activity.createPerson.avatar,//创建者头像
                            id:elem.activity._id,//活动id,
                            title:elem.activity.title,//活动标题
                            editTime:elem.activity.editTime//最后编辑时间
                        };
                    })
                }
            });
        }).catch(function(err){
            res.json({
                success:-1,
                desc:err.message,
                data:{}
            });
        });
        break;
    default:
        res.json({
            success: -1,
            desc:'不支持的操作',
            data:{}
        });
        break;
    }
});

exports.post('/detail', function(req, res, next) {
    activitySvc.getActivityDetail(req.body.corpId, req.body.id).then(function(result){
        if(req.body.identity === 2) {
            activitySvc.joinerReadActivity(req.body.corpId, req.body.userid, req.body.id);
        }
        activitySvc.getNoReadJoiner(req.body.corpId, req.body.id).then(function(results){
            res.json({
                success: 0,
                desc:'success',
                data:{
                    createPerson: result.createPerson._id,
                    personName:result.createPerson.name,//创建者名称
                    personPics:result.createPerson.avatar,//创建者头像url
                    title:result.title,
                    content:result.content,//文本内容
                    voice:result.voice,//语音id
                    pics:result.pics,//上传的图片
                    attachment:result.attachment,//附件，没想好怎么实现
                    leader:result.leader.map(function(leader){
                        return {
                            id: leader._id,
                            name: leader.name,
                            pic: leader.avatar
                        };
                    }),
                    partner:result.partner.map(function(partner){
                        return {
                            id: partner._id,
                            name: partner.name,
                            pic: partner.avatar
                        };
                    }),
                    createTime:result.createTime,//创建时间
                    editTime:result.editTime,//编辑
                    beginTime:result.beginTime,//开始时间
                    endTime:result.endTime,//结束时间
                    isNotifyBeforeBegin:result.isNotifyBeforeBegin,//开始前30分钟通知
                    isNotifyBeforeEnd:result.isNotifyBeforeEnd,//结束前30分钟通知
                    priority:result.priority,//优先级0.普通，1.不紧急但重要,2.紧急但不重要,3.紧急且重要
                    state:result.state,//状态，0.草稿，1.已发布，2.已关闭
                    unreadPerson:results.map(function(person){
                        return {
                            id: person.user._id,
                            name: person.user.name,
                            pic: person.user.avatar
                        };
                    })
                }
            });
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc:err.message,
            data:{}
        });
    });
});

router.post('/delete', function(req, res, next){
    activitySvc.deleteActivity(req.body.corpId, req.body.userid, req.body.id, req.body.identity)
    .then(function(){
        res.json({
            success: 0,
            desc:'success',
            data:{}
        });
    }).catch(function(err){
        res.json({
            success: -1,
            desc:err.message,
            data:{}
        });
    });
});

module.exports = router;