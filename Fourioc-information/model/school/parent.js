const util = require('util');
var Promise = require('promise');
//var db = require('../../api/mongodb');
var Student = require('./student');
var patriarchModel = [];
var getPatriarchModel = function(corpId){
    var key = corpId + '.patriarch';
    if(util.isNullOrUndefined(patriarchModel[key])){
        patriarchModel[key] = db.createModel(key,{
            userid:{type:String,required:true},//家长的微信企业号用户id
            sid:{type:String,unique: true,required:true},//家长对应的学生的学号
            name:{type:String,required:true},//家长备注名称
            status:Number,//0,禁用,1:启用
            relationship:{
                relation:Number,//关系0：父亲，1：母亲，2：爷爷，3：奶奶，4：姥爷，5：姥姥，6：其他
                content:String
            }
        });
    }
    return patriarchModel[key];
};
//创建家长
exports.createPatriarch = function(corpId,patriarch){
    var patriarchMdl = getPatriarchModel(corpId);
    return new Promise(function(resolve, reject){
        patriarchMdl.create(patriarch,function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.countParentByCls = function(corpId, cls){
    var patriarchMdl = getPatriarchModel(corpId);
    return Student.getStudentByClass(corpId,cls)
    .then(function(students){
        var sids = [];
        students.forEach(function(student){
            sids.push(student.sid); 
        });
        return new Promise(function(resolve, reject){
            patriarchMdl.count({sid:{'$in':sids}},function(err, count){
                if(err){
                    return reject(err);
                }
                return resolve(count);
            }); 
        });
    });
};

exports.getPatriarchByClass = function(corpId, cls){
    var patriarchMdl = getPatriarchModel(corpId);
    return Student.getStudentByClass(corpId, cls)
    .then(function(students){
        var sids = [];
        students.forEach(function(student){
            sids.push(student.sid); 
        });
        return new Promise(function(resolve, reject){
            patriarchMdl.where('sid').in(sids).exec(function(err,patriarches){
                if(err){
                    return reject(err);
                }
                return resolve(patriarches);
            });
            // patriarchMdl.find({sid:{"$in":sids}},function(err, patriarches){
            //     if(err){
            //         return reject(err);
            //     }
            //     return resolve(patriarches);
            // }) 
        });
    });
};

exports.getPatriarchesBySid = function(corpId, sid){
    var patriarchMdl = getPatriarchModel(corpId);
    return new Promise(function(resolve, reject){
        patriarchMdl.find({sid:sid},function(err, patriarches){
            if(err){
                return reject(err);
            }
            return resolve(patriarches);
        }); 
    });
};
exports.getPatriarchesByUseridAndSid = function(corpId, userid, sid){
    var patriarchMdl = getPatriarchModel(corpId);
    return new Promise(function(resolve, reject){
        patriarchMdl.findOne({userid:userid,sid:sid,status:1},function(err, patriarches){
            if(err){
                return reject(err);
            }
            return resolve(patriarches);
        }); 
    });
};
