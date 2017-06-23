var express = require('express');
var router = express.Router();
var Promise = require('promise');
var wxUser = require('../../model/contact/wxUser');
var Teacher = require('../../model/school/teacher');
var Parent = require('../../model/school/parent');
var Department = require('../../model/school/department');
var Staff = require('../../model/school/staff');
var util = require('util');
var school_teacher = require('../../model/school/school_teacher');
var school_department = require('../../model/school/school_department');

var getUserById = function(corpId,id){
    return wxUser.getUserByUserId(corpId, id);
}

router.post('/staff/all',function(req, res, next){
    if(req.body && req.body.corpId){
        school_teacher.findAllTeacher(req.body.corpId).then(function(staffs){
            var promises = [];
            staffs.forEach(function(staff){
                if(util.isNullOrUndefined(staff.userid) === false && staff.userid !== ""){
                  var tmp = {department:[], userid:staff.userid};
                  promises.push(school_teacher.getTeacherAllInfoByUserId(req.body.corpId,staff.userid).then(function(info){
                      tmp.status = info.weixin.status;
                      tmp.name = info.teacherName;
                      tmp.pic = info.weixin.avatar;
                      var dept_promises = [];
                      info.teacherDepartmentIds.forEach(function(department){
                          dept_promises.push(school_department.findDepartmentById(req.body.corpId, department.departmentId).then(function(dept){
                              tmp.department.push({departmentId:department.departmentId,name:dept.name});
                          }));
                      });
                      return Promise.all(dept_promises);
                  }).then(function(){
                      return Promise.resolve(tmp);
                  }))
                }
            })
            return Promise.all(promises);
        }).then(function(staff_array){
            return res.json({success:0, desc:"success",data:{staff:staff_array.filter(function(elem) {
                return elem.status == 1;
            })}});
        }).catch(function(err){
            return res.json({success:-1,desc:err.message,data:{}});
        });
    }else{
        res.json({success:-1,desc:"invalid request",data:{}});
    }
});


module.exports = router;
