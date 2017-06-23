const util = require('util');
var Promise = require('promise');
//var db = require('../../api/mongodb');
var teacherModel = [];
var getTeacherModel = function(corpId){
    var key = corpId + '.teacher';
    if(util.isNullOrUndefined(teacherModel[key])){
        teacherModel[key] = db.createModel(key,{
            teacher:{type:{userid:String,cls:Number},unique:true,required:true}
        });
    }
    return teacherModel[key];
}
//创建老师
exports.addTeacher = function(corpId,teacher){
    var teacherModel = getTeacherModel(corpId);
    return new Promise(function(resolve, reject){
        teacherModel.create(teacher,function(err, result){
           if(err){
               return reject(err);
           }
           return resolve(teacher);
       })
    })
}
//删除老师
exports.removeTeacher = function(corpId,teacher){
    var teacherModel = getTeacherModel(corpId);
    if(util.isNullOrUndefined(teacher)){
        return Promise.reject(new Error("teacher field is missed"));
    }else{
        return new Promise(function(resolve, reject){
            teacherModel.remove({teacher:teacher},function(err){
                if(err){
                    return reject(err);
                }
                return resolve();
            })
        });
    }
}

exports.getTeacherClsByUserId = function(corpId, userid){
    var teacherModel = getTeacherModel(corpId);
    return new Promise(function(resolve, reject){
       teacherModel.find({"teacher.userid":userid},function(err, teachers){
           if(err){
               return reject(err);
           }
           return resolve(teachers);
       }) 
    }).then(function(teachers){
        var teacher = {userid:userid,cls:[]};
        teachers.forEach(function(tmp){
            teacher.cls.push(tmp.teacher.cls)
        })
        return Promise.resolve(teacher);
    });
}

exports.getAllTeacher = function(corpId){
    var teacherModel = getTeacherModel(corpId);
    return new Promise(function(resolve, reject){
       teacherModel.find({},function(err, teachers){
           if(err){
               return reject(err);
           }
           return resolve(teachers);
       }) 
    });
}

exports.countTeacherInCls = function(corpId, cls){
    var teacherModel = getTeacherModel(corpId);
    return new Promise(function(resolve, reject){
       teacherModel.count({"teacher.cls":cls},function(err, count){
           if(err){
               return reject(err);
           }
           return resolve(count);
       }) 
    });
};

exports.getTeacherByCls = function(corpId, cls){
    var teacherModel = getTeacherModel(corpId);
    return new Promise(function(resolve, reject){
       teacherModel.find({"teacher.cls":cls},function(err, teachers){
           if(err){
               return reject(err);
           }
           return resolve(teachers);
       }) 
    }).then(function(teachers){
        var aa = [];
        teachers.forEach(function(teacher){
            aa.push(teacher.teacher);
        })
        return Promise.resolve(aa);
    });
}
