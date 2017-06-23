var Promise = require('promise');
var DB = require('../DB');
var util = require('util');
var WxUser = require('../contact/wxUser');
var weichat = require('../../api/wechat');
var logger = require('../../api/logger').logger;
var kk = 90102070901;
var user_m_sql=require('../user_m_sql');
exports.createTeacher = function(corpId, teacher){
    var userid = '';

    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'wxUser', {mobile:''+teacher.teacherTel}, function(err, res){
            if(err){
                logger.error('createTeacher 1 . mobile = ' + teacher.teacherTel+ ' . error = ' + err.message);
                return reject(err);
            }
            logger.info('createTeacher 2 . mobile = ' + teacher.teacherTel+ ' . res = ' + JSON.stringify(res));
            if(res){
                userid = res.userid;
                return resolve(true);
            }
            return resolve(false);
        });
    }).then(function(hasWeixinUser){
        logger.info('createTeacher 3 . mobile = ' + teacher.teacherTel+ '. hasWeixinUser = ' + hasWeixinUser);
        if(hasWeixinUser == false){
            return weichat.createWeixinUser(corpId, teacher.teacherTel,teacher.teacherName);
        }
    }).then(function(){
        logger.info('createTeacher 4 . mobile = ' + teacher.teacherTel);
        return weichat.getWeixinUser(corpId, ''+teacher.teacherTel);
    }).then(function(weixinUser){
        logger.info('createTeacher 4 . mobile = ' + teacher.teacherTel + '. weixinUser = ' + JSON.stringify(weixinUser));
        userid = weixinUser.userid;
        return WxUser.createWxUser(corpId, weixinUser);
    }).then(function(){
        logger.info('createTeacher 5 . mobile = ' + teacher.teacherTel);
    //查找是否该电话已经创建过老师，
    //如果创建过，就不创建了
        return new Promise(function(resolve, reject){
            DB.findOne(corpId, 'school_teacher', {teacherTel: teacher.teacherTel,status:0}, function(err, res){
                if(err){
                    logger.error('createTeacher 6 . mobile = ' + teacher.teacherTel + '. err = ' + err.message);
                    return reject(err);
                }
                return resolve(res);
            });
        }).then(function(findedTeacher){
            if(util.isNullOrUndefined(findedTeacher)){
                logger.info('createTeacher 6 . mobile = ' + teacher.teacherTel + '. findedTeacher = null');
                var tmp = {};
                tmp.corpId = teacher.corpId || corpId;//学校id
                tmp.userid = userid;
                tmp.teacherName = teacher.teacherName || '';
                tmp.teacherNickName = teacher.teacherNickName || '';
                tmp.teacherTel = teacher.teacherTel;
                tmp.teacherDepartmentIds = [];
                tmp.teacherClassIds = [];
                tmp.departmentHistory = [];
                tmp.classHistory = [];
                tmp.status = 0;
                if(teacher.teacherDepartmentIds){
                    teacher.teacherDepartmentIds.forEach(function(department){
                        tmp.teacherDepartmentIds.push({departmentId:department.departmentId, joinTime:Date.now()});
                    });
                }
                if(teacher.teacherClassIds){
                    teacher.teacherClassIds.forEach(function(classId){
                        tmp.teacherClassIds.push({classId:classId.classId, joinTime:Date.now()});
                    });
                }
                return new Promise(function(resolve, reject){
                    DB.save(corpId, 'school_teacher', tmp, function(err, res){
                        if(err){
                            logger.error('createTeacher 7 . mobile = ' + teacher.teacherTel + '. err = ' + err.message);
                            return reject(err);
                        }
                        logger.info('createTeacher 6 . mobile = ' + teacher.teacherTel + '. findedTeacher = ' + JSON.stringify(res.toObject()));
                        return resolve(res.toObject());
                    });
                });
            }else{
                logger.info('createTeacher 6 . mobile = ' + teacher.teacherTel + '. findedTeacher = ' + JSON.stringify(findedTeacher.toObject()));
                return Promise.resolve(findedTeacher.toObject());
            }
        });
    }).then(function(res){
        logger.info('createTeacher 7 . mobile = ' + teacher.teacherTel + '. res = ' + JSON.stringify(res));
        return Promise.resolve(res);
    });
};

exports.updateTeacher = function(corpId, teacher){
  //退出的部门和班级
    var leaveDept = [];
    var leaveCls = [];
  //新加入的部门和班级
    var joinDept = [];
    var joinCls = [];
    var timeNow = Date.now();
    return new Promise(function(resolve, reject){
        DB.findById(corpId, 'school_teacher', teacher.teacherId, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    }).then(function(res){
    //查找退出的部门，
        res.teacherDepartmentIds.forEach(function(department){
            var finded = teacher.teacherDepartmentIds.find(function(elem){
                return elem.departmentId === department.departmentId;
            });
            if(util.isNullOrUndefined(finded)){//没找到，则可以认为从该部门中退出了
                leaveDept.push(department);
            }
        });
        res.teacherClassIds.forEach(function(classId){
            var finded = teacher.teacherClassIds.find(function(elem){
                return elem.classId === classId.classId;
            });
            if(util.isNullOrUndefined(finded)){//没找到，则可以认为从该部门中退出了
                leaveCls.push(classId);
            }
        });
    //查找新加入的部门
        teacher.teacherDepartmentIds.forEach(function(department){
            var finded = res.teacherDepartmentIds.find(function(elem){
                return elem.departmentId === department.departmentId;
            });
            if(util.isNullOrUndefined(finded)){
                joinDept.push({departmentId:department.departmentId, joinTime: timeNow});
            }
        });
        teacher.teacherClassIds.forEach(function(classId){
            var finded = res.teacherClassIds.find(function(elem){
                return elem.classId === classId.classId;
            });
            if(util.isNullOrUndefined(finded)){
                joinCls.push({classId:classId.classId, joinTime: timeNow});
            }
        });
        leaveDept.forEach(function(dept){
            res.teacherDepartmentIds.pull(dept);
            res.departmentHistory.push({departmentId:dept.departmentId, joinTime:dept.joinTime, leaveTime:timeNow});
        });
        leaveCls.forEach(function(cls){
            res.teacherClassIds.pull(cls);
            res.classHistory.push({classId:cls.classId, joinTime:cls.joinTime, leaveTime:timeNow});
        });
        joinDept.forEach(function(dept){
            res.teacherDepartmentIds.push(dept);
        });
        joinCls.forEach(function(cls){
            res.teacherClassIds.push(cls);
        });

        if(util.isNullOrUndefined(teacher.teacherName) === false && teacher.teacherName !== res.teacherName){
            res.teacherName = teacher.teacherName;
        }

        if(util.isNullOrUndefined(teacher.teacherNickName) === false && teacher.teacherNickName !== res.teacherNickName){
            res.teacherNickName = teacher.teacherNickName;
        }

        if(util.isNullOrUndefined(teacher.teacherTel) === false && teacher.teacherTel !== res.teacherTel){
            res.teacherTel = teacher.teacherTel;
        }

        return new Promise(function(resolve, reject){
            res.save(function(err, product, numberAffected){
                if(err){
                    return reject(err);
                }
                return resolve(product.toObject());
            });
        });
    });
};

exports.deleteTeacher = function(corpId, teacherId){
    var timeNow = Date.now();
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'school_teacher', {_id:teacherId}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    }).then(function(res){
        var teacherDepartmentIds = res.teacherDepartmentIds;
        var teacherClassIds = res.teacherClassIds;
        res.teacherDepartmentIds = [];
        res.teacherClassIds = [];
        res.status = 2;
        if(util.isNullOrUndefined(teacherDepartmentIds) === false){
            teacherDepartmentIds.forEach(function(department){
                res.departmentHistory.push({departmentId:department.departmentId, joinTime:department.joinTime, leaveTime:timeNow});
            });
        }
        if(util.isNullOrUndefined(teacherClassIds) === false){
            teacherClassIds.forEach(function(cls){
                res.classHistory.push({classId:cls.classId, joinTime:cls.joinTime, leaveTime:timeNow});
            });
        }
        return new Promise(function(resolve, reject){
            res.save(function(err, product, numberAffected){
                if(err){
                    return reject(err);
                }
                return resolve(product);
            });
        });
    });
};

exports.findTeacherById = function(corpId, teacherId){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'school_teacher', {_id:teacherId}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.findTeachersByDepartment = function(corpId, departmentId){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'school_teacher', {'teacherDepartmentIds.departmentId':''+departmentId}, {},function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.findTeachersByClass = function(corpId, classId){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'school_teacher', {'teacherClassIds.classId':''+classId}, {},function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.findAllTeacher = function(corpId){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'school_teacher', {status:0}, {},function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.getTeacherByMobile = function(corpId, mobile){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'school_teacher', {teacherTel:mobile, status:0}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.isTeacher = function(corpId, userid){//查看是否是老师  查看是否有这个人
    return new Promise(function(resolve, reject){
        user_m_sql.query_teacher(userid,function(err,result){
             if(err){
                return reject(err);
            }else{
              if(result==""||result==null){
                return resolve(false);
              }else{
                return resolve(true);
              }
            }
        });
    });
};
//得到信息
exports.getTeacherAllInfoByUserId = function(corpId, userid){
    
    var teacherInfo = {};
    return new Promise(function(resolve, reject){
     DB.findOne(corpId, 'school_teacher', {userid:userid, status:0}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    }).then(function(teacher){
        console.log('teacher.info = ' + JSON.stringify(teacher));
        teacherInfo.teacherId = teacher.id;
        teacherInfo.teacherName = teacher.teacher_name;
       // teacherInfo.teacherNickName = teacher.;
        teacherInfo.teacherTel = teacher.phone;
        teacherInfo.userid = teacher.userid;
        teacherInfo.weixin = {};
        // teacherInfo.teacherDepartmentIds = teacher.teacherDepartmentIds.map(function(department){
        //     return {departmentId:department.departmentId};
        // });
        // teacherInfo.teacherClassIds = teacher.teacherClassIds.map(function(cls){
        //     return {classId:cls.classId};
        // });
        // return WxUser.getUserByMobile(corpId, teacher.phone).then(function(wxuser){
        //     teacherInfo.weixin.status = wxuser.status;
        //     teacherInfo.weixin.userid = wxuser.userid;
        //     teacherInfo.weixin.avatar = wxuser.avatar;
            
        // });
        return Promise.resolve(teacherInfo);
    });
};

exports.getTeacherAllInfo = function(corpId, teacherId){
    var teacherInfo = {};
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'school_teacher', {_id:teacherId}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    }).then(function(teacher){
        teacherInfo.teacherId = teacherId;
        teacherInfo.teacherName = teacher.teacherName;
        teacherInfo.teacherNickName = teacher.teacherNickName;
        teacherInfo.teacherTel = teacher.teacherTel;
        teacherInfo.weixin = {};
        teacherInfo.teacherDepartmentIds = teacher.teacherDepartmentIds.map(function(department){
            return {departmentId:department.departmentId};
        });
        teacherInfo.teacherClassIds = teacher.teacherClassIds.map(function(cls){
            return {classId:cls.classId};
        });
        return WxUser.getUserByMobile(corpId, teacher.teacherTel).then(function(wxuser){
            teacherInfo.weixin.status = wxuser.status;
            teacherInfo.weixin.userid = wxuser.userid;
            teacherInfo.weixin.avatar = wxuser.avatar;
            return Promise.resolve(teacherInfo);
        });
    });
};
