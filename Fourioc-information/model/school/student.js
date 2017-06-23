const util = require('util');
var Promise = require('promise');
//var db = require('../../api/mongodb');
var studentModel = [];
var getStudentHistoryModel = function(corpId){
    var key = corpId + '.student_history';
    if(util.isNullOrUndefined(studentModel)){
        studentModel[key] = db.createModel(key,{
            student:{type:{
                sid:String,
                schoolyear:Number,
                cls:Number,
                updateReason:String
            },unique:true}
        });
    }
    return studentModel[key];
}
var getStudentModel = function(corpId){
    var key = corpId + '.student_info';
    if(util.isNullOrUndefined(studentModel[key])){
        studentModel[key] = db.createModel(key,{
            sid:{type:String,unique:true,required:true},
            sex:{type:Number,required:true},
            name:{type:String,required:true},
            cls:{type:Number,required:true},
            schoolyear:{type:Number,required:true},//当前学生的学年，例如2016，用于历史记录
        });
    }
    return studentModel[key];
}
//创建企业号的管理组
exports.createStudent = function(corpId,student){
    var studentMdl = getStudentModel(corpId);
    return new Promise(function(resolve, reject){
        studentMdl.create(student,function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    })
}

exports.updateStudent = function(corpId, student){
    var studentMdl = getStudentModel(corpId);
    return new Promise(function(resolve, reject){
        studentMdl.findOne({sid:student.sid},function(err,result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    }).then(function(result){//
        if((result.cls !== student.cls)|| (result.schoolyear !== student.schoolyear)){//学生的班级或者年级发生了变化
            var historyMdl = getStudentHistoryModel(corpId);
            return new Promise(function(resolve, reject){
                var history = {
                    student:{
                        sid:result.sid,
                        schoolyear:result.schoolyear,
                        cls:result.cls,
                        updateReason:result.updateReason||""
                    }
                };
                historyMdl.create(history,function(err, data){
                    if(err){
                        return reject(err);
                    }
                    return resolve();
                })
            })
        }else{
            Promise.resolve();
        }
    }).then(function(){
        return new Promise(function(resolve, reject){
            studentMdl.findOneAndUpdate({sid:student.sid},student,function(err,data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            })
        });
    });
}

exports.getStudentByClass = function(corpId, cls){
    var studentMdl = getStudentModel(corpId);
    return new Promise(function(resolve, reject){
       studentMdl.find({cls:cls},function(err, students){
           if(err){
               return reject(err);
           }
           return resolve(students);
       }) 
    });
}

exports.getStudentBySid = function(corpId, sid){
    var studentMdl = getStudentModel(corpId);
    return new Promise(function(resolve, reject){
       studentMdl.findOne({sid:sid},function(err, student){
           if(err){
               return reject(err);
           }
           return resolve(student);
       }) 
    });
}
