var express = require('express');
var router = express.Router();
var util = require('util');
var Promise = require('promise');
// var userSvc = require('../../../../service/user');
// var departmentSvc = require('../../../../service/department');
// var wxContactSvc = require('../../../../service/wxcontact');
// var rateSvc = require('../../../../service/rate');
var logger = require('../../../../api/logger').logger;
var async = require('async');

router.post('/deliver', function(req, res, next) {
    return rateSvc.deliver(req.body.corpId, req.body.rate).then(function(result){
        res.json({
            success:Number,//0：成功,-1：失败
            desc:String,//描述，失败原因
            data:{}
        });
        if(result.state === 1) {
            async.each(result.parent, function(parent, cb){
                rateSvc.saveRateOfParent(req.body.corpId, parent._id).then(function(){
                    cb();
                }).catch(function(err){
                    logger.error(JSON.stringify({
                        service:'api.v1.rate.deliver',
                        err:err.message
                    }));
                    cb(err);
                });
            }, function(err) {
                return rateSvc.notifyNoRead(req.body.corpId, result._id).catch(function(err){
                    logger.error(JSON.stringify({
                        service:'api.v1.rate.deliver',
                        err:err.message
                    }));
                });
            });
        }
    });
});

router.post('/list', function(req, res, next) {
    switch(parseInt(req.body.identity)){
    case 1:
        rateSvc.getTeacherRates(req.body.corpId, req.body.info.userid, req.body.info.state).then(function(results){
            res.json({
                success: 0,
                desc:'success',
                data:{
                    list:results.map(function(result){
                        return {
                            creator:{
                                id:result.createPerson._id,//创建者id
                                name:result.createPerson.name,//创建者名称
                                pic:result.createPerson.avatar//创建者头像
                            },
                            rate:{
                                id:result._id,//评价id，
                                title:result.title,//后台生成的标题
                                state:result.state,//评价状态
                                editTime:result.editTime,//发布|撤销日期
                                sid:''//只有查询家长的评语时才会有学生id
                            }
                        };
                    })
                }
            });
        }).catch(function(err){
            res.json({
                success: -1,
                desc:err.message,
                data:{}
            });
        });
        break;
    case 2:
        rateSvc.getParentRates(req.body.corpId, req.body.info.userid, req.body.info.state).then(function(results){
            res.json({
                success: 0,
                desc:'success',
                data:{
                    list:results.map(function(result){
                        return {
                            creator:{
                                id:result.rate.createPerson._id,//创建者id
                                name:result.rate.createPerson.name,//创建者名称
                                pic:result.rate.createPerson.avatar//创建者头像
                            },
                            rate:{
                                id:result.rate._id,//评价id，
                                title:result.rate.title,//后台生成的标题
                                state:result.rate.state,//评价状态
                                editTime:result.rate.editTime,//发布|撤销日期
                                sid:''//只有查询家长的评语时才会有学生id
                            }
                        };
                    })
                }
            });
        }).catch(function(err){
            res.json({
                success: -1,
                desc:err.message,
                data:{}
            });
        });
        break;
    }
});

router.post('/get', function(req, res, next){
    rateSvc.getTeacherRate(req.body.info.rateId).then(function(rate){
        res.json({
            success:0,
            desc:'success',
            data:{
                creator:{
                    id:rate.createPerson._id,
                    name:rate.createPerson.name,
                    pic:rate.createPerson.avatar
                },
                parent:rate.parent.map(function(parent){
                    return {
                        id:parent._id,
                        name:parent.name,
                        bakname:'家长',
                        sid:'',
                        pic:parent.avatar
                    };
                })
            }
        });
        if(req.body.info.identity === 2){
            rateSvc.parentReadRate(req.body.info.ext.id, req.body.info.rateId);
        }
    }).catch(function(err){
        res.json({
            success: -1,
            desc:err.message,
            data:{}
        });
    });
});

router.post('/delete', function(req, res, next) {
    switch(parseInt(req.body.info.identity)){
    case 1:
        return rateSvc.deleteParentRate(req.body.corpId, req.body.info.id, req.body.info.rateId).then(function(){
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
    case 2:
        return rateSvc.deleteTeacherRate(req.body.corpId, req.body.info.rateId).then(function(){
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
    }
});

router.post('/cancel', function(req, res, next){
    return rateSvc.cancelTeacherRate(req.body.corpId, req.body.info.rateId).then(function(){
        res.json({
            success:0,
            desc:'success',
            data:{}
        });
        rateSvc.notifyCancel(req.body.corpId, req.body.info.rateId);
    }).catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

module.exports = router;