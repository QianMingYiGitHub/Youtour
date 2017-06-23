var Promise = require('promise');
var DB = require('../DB');
var wxUser = require('../contact/wxUser');
var util = require('util');
var weichat = require('../../api/wechat');
var class_m_sql=require('../classes_m_sql');
exports.createParent = function(corpId, parent){
    var userid = '';
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'wxUser', {mobile:''+parent.tel}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    }).then(function(wxuser){
        if(util.isNullOrUndefined(wxuser)){
            return weichat.createWeixinUser(corpId, parent.tel, parent.realName).then(function(){
                return weichat.getWeixinUser(corpId, ''+parent.tel);
            }).then(function(weixinUser){
                return wxUser.createWxUser(corpId, weixinUser);
            });
        }else{
            return Promise.resolve(wxuser);
        }
    }).then(function(wxuser){
        userid = wxuser.userid;
        return new Promise(function(resolve, reject){
            DB.findOne(corpId, 'student_parent', {studentId:parent.studentId, tel: parent.tel}, function(err, res){
                if(err){
                    return reject(err);
                }
                return resolve(res);
            });
        });
    }).then(function(findedParent){
        if(util.isNullOrUndefined(findedParent)){
            return new Promise(function(resolve, reject){
                var tmp = {};
                tmp.corpId = parent.corpId || corpId;
                tmp.userid = userid;
                tmp.classId = parent.classId;
                tmp.studentId = parent.studentId;
                tmp.realName = parent.realName || '';
                tmp.nickName = parent.nickName || '';
                tmp.tel = parent.tel;
                DB.save(corpId,'student_parent',tmp, function(err, res){
                    if(err){
                        return reject(err);
                    }
                    return resolve(res.toObject());
                });
            });
        }
    });
};

exports.updateParentForStudent = function(corpId, studentId, chg){
    return new Promise(function(resolve, reject){
        DB.update(corpId, 'student_parent', {studentId:studentId}, {'$set':chg}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};


exports.updateParent = function(corpId, id, parent){
    return new Promise(function(resolve, reject){
        DB.updateById(corpId, 'student_parent', id, {'$set':parent}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res.toObject());
        });
    });
};

exports.deleteParent = function(corpId, parentId){
    return new Promise(function(resolve, reject){
        DB.updateById(corpId, 'student_parent', parentId, {'$set':{status:1}}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res.toObject());
        });
    });
};

exports.deleteParentByClass = function(corpId, classId){
    return new Promise(function(resolve, reject){
        DB.update(corpId, 'student_parent', {classId:classId}, {'$set':{status:1}}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res.toObject());
        });
    });
};

exports.deleteParentByStudent = function(corpId, studentId){
    return new Promise(function(resolve, reject){
        DB.update(corpId, 'student_parent', {studentId:studentId}, {'$set':{status:1}}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.getParentByClass = function(corpId, classId, status){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'student_parent', {classId:classId, status: status||0}, {},function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.getParentByStudent = function(corpId, studentId, status){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'student_parent', {studentId:studentId, status: status||0}, {},function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.getParentsByMobile = function(corpId, mobile){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'student_parent', {tel:mobile}, {},function(err, parents){
            if(err){
                return reject(err);
            }
            return resolve(parents);
        });
    });
};

exports.getParentsByUserId = function(corpId, userid){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'student_parent', {userid:userid, status:0}, {},function(err, parents){
            if(err){
                return reject(err);
            }
            return resolve(parents);
        });
    });
};

exports.isParent = function(corpId, userid){
    return new Promise(function(resolve, reject){
        class_m_sql.query_parent(userid,function(err,result){
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
 
exports.getParentAllInfoByUserIdAndSid = function(corpId, userid, sid){
    var parentInfo = {};
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'student_parent', {userid: userid, studentId:sid,status:0}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    }).then(function(parent){
        if(util.isNullOrUndefined(parent)){
            return Promise.reject(new Error('家长不存在'));
        }
        console.log('parent.info = ' + JSON.stringify(parent));
        parentInfo.userid = parent.userid;
        parentInfo.parentId = parent._id;
        parentInfo.realName = parent.realName;
        parentInfo.nickName = parent.nickName;
        parentInfo.corpId = corpId;//学校id
        parentInfo.classId = parent.classId;
        parentInfo.studentId = parent.studentId;//学生编号
        parentInfo.tel = parent.tel;//电话
        return wxUser.getUserByMobile(corpId, parent.tel).then(function(wxuser){
            if(wxuser){
                parentInfo.wxuser = wxuser.userid;
                if(wxuser.avatar){
                    parentInfo.avatar = wxuser.avatar;
                }
            }
            return Promise.resolve(parentInfo);
        });
    });
};

exports.getParentAllInfoById = function(corpId, parentId){
    var parentInfo = {};
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'student_parent', {_id: parentId}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    }).then(function(parent){
        parentInfo.parentId = parent._id;
        parentInfo.userid = parent.userid;
        parentInfo.realName = parent.realName;
        parentInfo.nickName = parent.nickName;
        parentInfo.corpId = corpId;//学校id
        parentInfo.classId = parent.classId;
        parentInfo.studentId = parent.studentId;//学生编号
        parentInfo.tel = parent.tel;//电话
        return wxUser.getUserByMobile(corpId, parent.tel).then(function(wxuser){
            if(wxuser){
                parentInfo.wxuser = wxuser.userid;
                if(wxuser.avatar){
                    parentInfo.avatar = wxuser.avatar;
                }
                parentInfo.status = wxuser.status;
            }
            return Promise.resolve(parentInfo);
        });
    });
};
