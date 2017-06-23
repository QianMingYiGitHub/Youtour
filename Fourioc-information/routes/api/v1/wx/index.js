var express = require('express');
var router = express.Router();
var util = require('util');
var Promise = require('promise');
var userSvc = require('../../../../service/user');
var departmentSvc = require('../../../../service/department');
var wxContactSvc = require('../../../../service/wxcontact');
var async = require('async');
var wechat = require('../../../../api/wechat');
/* GET home page. */
router.get('/media/:corpId', function( req, res, next) {
    wechat.getCorpManager(req.params.corpId).api.batchgetMaterial(1, 'mpnews', 0, 50, function(err, result) {
        // res.render('medias', result.itemlist || []);
        res.json(result);
    });
});

router.get('/media/:corpId/:mediaId/:appId', function(req, res, next) {
    wechat.getCorpManager(req.params.corpId, req.params.appId)[req.params.appId].send({touser:'@all'},{
        'msgtype': 'mpnews', 
        'agentid': req.params.appId, 
        'mpnews': {
            'media_id': req.params.mediaId
        }, 
        'safe': 0
    }, function(err, result) {
        res.json(result);
    });
});

router.post('/class/get', function(req, res, next) {
    userSvc.findUserById(req.body.id).then(function(user){
        var classInfos = [];
        user.department.forEach(function(department) {
            if(department.kind === departmentSvc.department_kind.classroom) {
                classInfos.push({id:department._id, name: department.name});
            }
        });
        async.eachSeries(classInfos, function(classInfo, cb){
            return userSvc.findUsersOfDepartment(user.corp._id, classInfo.id, 0).then(function(results){
                classInfo.total = results.length;
                cb();
            }).catch(function(err){
                cb(err);
            });
        }, function(err){
            if(err) {
                res.json({
                    success: -1,
                    desc: err.message,
                    data:{}
                });
            }else{
                res.json({
                    success: 0,
                    desc: 'success',
                    data:{
                        class:classInfos
                    }
                });
            }
        });
    });
});

router.post('/class/getteacher', function(req, res, next) {
    userSvc.findUsersOfDepartment(wxContactSvc.LocalDepartIdToWxCorpId(req.body.id), req.body.id, 0).then(function(users) {
        return res.json({
            success: 0,
            desc: 'success',
            data:{
                teacher:users.filter(function(user){
                    return false === util.isNullOrUndefined(user.departmentOfTeacher.find(function(elem){
                        return elem._id === req.body.id;
                    }));
                }).map(function(user){
                    return {
                        id:user._id,//教师id
                        name:user.name,//教师名称
                        class:user.department.filter(function(dept){
                            return dept.kind === departmentSvc.department_kind.classroom;
                        }).map(function(dept){
                            return dept._id;
                        }),//教师所在班级
                        pic:user.avatar//头像url
                    };
                })
            }
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.post('/class/getparent', function(req, res, next) {
    userSvc.findUsersOfDepartment(wxContactSvc.LocalDepartIdToWxCorpId(req.body.id), req.body.id, 0).then(function(users) {
        return res.json({
            success: 0,
            desc: 'success',
            data:{
                teacher:users.filter(function(user){
                    return false === util.isNullOrUndefined(user.departmentOfParent.find(function(elem){
                        return elem._id === req.body.id;
                    }));
                }).map(function(user){
                    return {
                        userid:user._id,//教师id
                        sid:'',//学生学号
                        bakname:'家长',//家长备注名称，如某某的爸爸，某某的妈妈，某某的家长
                        class:user.departmentOfParent.map(function(elem){
                            return elem._id;
                        }),//家长所在班级,因为家长与学号绑定了，所以可能出现一个家长在同一班级里出现两个的情况，只是sid肯定是唯一的
                        name:user.name,//教师名称
                        pic:user.avatar//头像url
                    };
                })
            }
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.post('/school/staff/all', function(req, res, next) {
    userSvc.findUsersOfDepartment(req.body.corpId, wxContactSvc.wxDepartIdToLocalDepartId(req.body.corpId, 1), 1).then(function(users){
        var Teachers = users.filter(function(user){
            return (user.departmentOfTeacher.length > 0);
        });
        res.json({
            success: 0,
            desc:'success',
            data:{
                staff: Teachers.map(function(teacher){
                    return {
                        userid: teacher._id,
                        name: teacher.name,
                        pic: teacher.avatar,
                        department:teacher.department.map(function(dept){
                            return {
                                id:dept._id,
                                name:dept.name
                            };
                        })
                    };
                })
            }
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc:err.message,
            data:{}
        });
    });
});

module.exports = router;