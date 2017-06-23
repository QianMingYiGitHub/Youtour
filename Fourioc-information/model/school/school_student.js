var Promise = require('promise');
var DB = require('../DB');
var util = require('util');
var school_parent = require('./school_parent');

//
// school_student:{//学校学生
//   corpId:String,//学校id
//   studentId:String,//学号
//   name:String,
//   sex:Number,//性别，0：男，1：女
//   classId:String,//学生所在班级id
//   joinTime:{type:Date, default:Date.now},//加入時間
//   classHistory:[{//记录学生所在班级变化历史，包括班级名称变化
//     classYear:Number,//学年
//     classId:String, //班级id
//     className:String, //班级名称
//     joinTime:Date, //加入班级时间
//     leaveTime:Date//离开班级时间
//   }]
// },

exports.createStudent = function(corpId, student){
    return new Promise(function(resolve, reject){
        var tmp = {
            corpId: student.corpId || corpId,
            studentNumber: student.studentNumber,
            name:student.name||'',
            sex:student.sex,
            classId:student.classId,
            status:student.status||0,
            classHistory:[]
        };
        DB.save(corpId, 'school_student', tmp, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res.toObject());
        });
    });
};

exports.deleteStudent = function(corpId, studentId){
    return new Promise(function(resolve, reject){
        DB.updateById(corpId, 'school_student', studentId, {'$set':{status:2}}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.deleteStudentByClass = function(corpId, classId){
    return new Promise(function(resolve, reject){
        DB.update(corpId, 'school_student', {classId:classId}, {'$set':{status:2}}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.updateClassNameOfStudents = function(corpId, classId, oldname){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'school_student', {classId:classId}, {},function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    }).then(function(res){
        var promises = [];
        var timeNow = Date.now();
        res.forEach(function(student){
            var joinTime = student.joinTime;
            student.joinTime = timeNow;
            student.classHistory.push({classId:classId,className:oldname,joinTime:joinTime,leaveTime:timeNow});
            promises.push(new Promise(function(resolve, reject){
                student.save(function(err, product, numberAffected){
                    if(err){
                        return reject(err);
                    }
                    return resolve(product);
                });
            }));
        });
        return Promise.all(promises);
    });
};

exports.updateStudent = function(corpId, condition, student){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'school_student', condition, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    }).then(function(res){
        if(util.isNullOrUndefined(student.name) === false){
            res.name = student.name;
        }
        if(util.isNullOrUndefined(student.sex) === false){
            res.sex = student.sex;
        }
        if(util.isNullOrUndefined(student.status) === false){
            res.status = student.status;
        }
        if(util.isNullOrUndefined(student.studentNumber) === false){
            res.studentNumber = student.studentNumber;
        }
    
        if(util.isNullOrUndefined(student.classId) === false && res.classId !== student.classId){
            return new Promise(function(resolve, reject){
                DB.findOne(corpId, 'school_department', {id: res.classId}, function(err, result){
                    if(err){
                        return reject(err);
                    }
                    return resolve(result.toObject());
                });
            }).then(function(result){
                res.classHistory.push({classId:res.classId, className:result.name, joinTime: res.joinTime, leaveTime:Date.now()});
                res.classId = student.classId;
                res.joinTime = Date.now();
            }).then(function(){
                return school_parent.updateParentForStudent(corpId, res._id, {classId:res.classId}).then(function(){
                    return Promise.resolve(res);
                });
            });
        }else if(util.isNullOrUndefined(student.status) === false && (student.status !== res.status) && (student.status === 1 || student.status === 2)){
            return new Promise(function(resolve, reject){
                DB.findOne(corpId, 'school_department', {id: student.classId}, function(err, result){
                    if(err){
                        return reject(err);
                    }
                    return resolve(result.toObject());
                });
            }).then(function(result){
                res.classHistory.push({classId:res.classId, className:result.name, joinTime: res.joinTime, leaveTime:Date.now()});
            }).then(function(){
                return school_parent.updateParentForStudent(corpId, student.studentId, {status:student.status}).then(function(){
                    return Promise.resolve(res);
                });
            });
        }else{
            return Promise.resolve(res);
        }
    }).then(function(res){
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

exports.findStudentsByClass = function(corpId, classId, status){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'school_student', {classId: classId, status:status || 0}, {},function(err, student_array){
            if(err){
                return reject(err);
            }
            return resolve(student_array);
        });
    });
};
exports.findStudentById = function(corpId, id){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'school_student', {_id:id}, function(err, student){
            if(err){
                return reject(err);
            }
            return resolve(student);
        });
    });
};
exports.findStudentByNumber = function(corpId, num){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'school_student', {studentNumber:num}, function(err, student){
            if(err){
                return reject(err);
            }
            return resolve(student);
        });
    });
};
