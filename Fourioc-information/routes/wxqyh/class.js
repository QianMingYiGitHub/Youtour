var util = require('util');
var express = require('express');
var router = express.Router();
var Promise = require('promise');
var wxUser = require('../../model/contact/wxUser');
var logger = require('../../api/logger').logger;

var school_department = require('../../model/school/school_department');
var school_teacher = require('../../model/school/school_teacher');
var school_student = require('../../model/school/school_student');
var school_parent = require('../../model/school/school_parent');

router.post('/get',function(req, res, next){
    if(req.body && req.body.id){//得到什么
        school_teacher.getTeacherAllInfoByUserId(req.body.corpId, req.body.id).then(function(teacher){
            var promises = [];
            teacher.teacherClassIds.forEach(function(clsId){
                var tmp = {id:clsId.classId, name:"", total:0};
                // classes.push(tmp);
                promises.push(school_department.findDepartmentById(req.body.corpId, clsId.classId).then(function(department){
                    tmp.name = department.name;
                    return school_teacher.findTeachersByClass(req.body.corpId, clsId.classId);
                }).then(function(teachers){
                    tmp.total += teachers.length;
                    return school_parent.getParentByClass(req.body.corpId, clsId.classId);
                }).then(function(parents){
                    tmp.total += parents.length;
                    return Promise.resolve(tmp);
                }));
            });
            return Promise.all(promises)
        }).then(function(classes){
            return res.json({success:0,desc:"success",data:{class:classes}});
        }).catch(function(err){
            return res.json({success:-1,desc:err.message,data:{}});
        })
    }else{
        res.json({success:-1,desc:"invalid request",data:{}});
    }
});

router.post('/getteacher',function(req, res, next){
    if(req.body && req.body.id){
        logger.info("/wxqyh/class/getteacher.body = ".concat(JSON.stringify(req.body)));
        school_teacher.findTeachersByClass(req.body.corpId, ""+req.body.id).then(function(teachers){
            var promises = [];
            teachers.forEach(function(teacher){
                if(util.isNullOrUndefined(teacher.userid) === false && teacher.userid !== ""){
                  // logger.info("/wxqyh/class/getteacher.teacher = ".concat(JSON.stringify(teacher)));
                  var tmp = {id:teacher.userid, name:teacher.teacherName,class:[],pic:""};
                  teacher.teacherClassIds.forEach(function(clsId){
                      tmp.class.push(clsId.classId);
                  });
                  promises.push(school_teacher.getTeacherAllInfo(req.body.corpId, teacher._id).then(function(info){
                      // logger.info("/wxqyh/class/getteacher.teacherinfo = ".concat(JSON.stringify(info)));
                      tmp.status = info.weixin.status;
                      tmp.pic = info.weixin.avatar;
                      return Promise.resolve(tmp);
                  }));
                }
            })
            return Promise.all(promises);
        }).then(function(teachers){
            logger.info("/wxqyh/class/getteacher.result = ".concat(JSON.stringify(teachers)));
            return res.json({success:0,desc:"success",data:{teacher:teachers.filter(function(elem) {
                return elem.status == 1;
            })}});
        }).catch(function(err){
            logger.error("/wxqyh/class/getteacher.error = ".concat(JSON.stringify(err)));
            return res.json({success:-1,desc:err.message,data:{}});
        });
    }else{
        res.json({success:-1,desc:"invalid param",data:{}});
    }
});

router.post('/getparent',function(req, res, next){
    if(req.body && req.body.id && req.body.corpId){
        logger.info("/wxqyh/class/getparent.body = ".concat(JSON.stringify(req.body)));
        school_parent.getParentByClass(req.body.corpId, "" + req.body.id).then(function(parents){
            logger.info("/wxqyh/class/getparent.parents = ".concat(JSON.stringify(parents)));
            var promises = [];
            parents.forEach(function(parent){
                if(util.isNullOrUndefined(parent.userid) === false && parent.userid !== ""){
                  var tmp = {
                      userid:parent.userid,
                      sid:parent.studentId,
                      name:parent.realName,
                      bakname:parent.nickName,
                      cls:parent.classId,
                      pic:""
                  };
                  promises.push(school_parent.getParentAllInfoById(req.body.corpId,parent._id).then(function(info){
                      tmp.pic = info.avatar;
                      tmp.status = info.status;
                      return Promise.resolve(tmp);
                  }));
                }
            });
            return Promise.all(promises);
        }).then(function(parents){
            logger.info("/wxqyh/class/getparent.result = ".concat(JSON.stringify(parents)));
            return res.json({success:0,desc:"success",data:{parent:parents.filter(function(elem) {
                return elem.status == 1;
            })}});
        }).catch(function(err){
            logger.info("/wxqyh/class/getparent.err = ".concat(err.message));
            return res.json({success:-1,desc:err.message,data:{}});
        })
    }else{
        return res.json({success:-1,desc:"invalid param",data:{}});
    }
});

module.exports = router;
