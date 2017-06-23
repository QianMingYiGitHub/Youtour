const util = require('util');
var Promise = require('promise');
//var db = require('../../api/mongodb');
var department = require('./department');
var WxUser = require('../contact/wxUser');
var staffModel = [];
var getStaffModel = function(corpId){
    var key = corpId + '.staff';
    if(util.isNullOrUndefined(staffModel[key])){
        staffModel[key] = db.createModel(key,{
            userid:{type:String,unique:true,required:true},
            department:[{id:Number,name:String}],
            status:Number//关注状态，
        });
    }
    return staffModel[key];
};
//创建教职工
exports.addStaff = function(corpId,staff){
    var staffMdl = getStaffModel(corpId);
    return new Promise(function(resolve, reject){
        staffMdl.create(staff,function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};
exports.updateStaff = function(corpId, staff){
    var staffMdl = getStaffModel(corpId);
    return new Promise(function(resolve, reject){
        staffMdl.update({userid:staff.userid},staff,function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};
//删除教职工
exports.removeStaff = function(corpId,userid){
    var staffMdl = getStaffModel(corpId);
    return new Promise(function(resolve, reject){
        staffMdl.remove({userid:userid},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.subscribeStaff = function(corpId, userid){
    var staffMdl = getStaffModel(corpId);
    return new Promise(function(resolve, reject){
        staffMdl.update({userid:userid},{status:1},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.unsubscribeStaff = function(corpId, userid){
    var staffMdl = getStaffModel(corpId);
    return new Promise(function(resolve, reject){
        staffMdl.update({userid:userid},{status:4},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.getAllStaff = function(corpId){
    var staffMdl = getStaffModel(corpId);
    return new Promise(function(resolve, reject){
        staffMdl.find({status:1}).select('userid department.id department.name').exec(function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

exports.getStaffByDeptId = function(corpid, deptid, fetchchild){
    var staffMdl = getStaffModel(corpid);
    var depts = [deptid];
    return Promise.resolve().then(function(){
        if(fetchchild === 1){
            var tmpdepts = [];
            return department.getDepartmentByParentId(corpid, deptid, fetchchild, tmpdepts).then(function(){
                tmpdepts.forEach(function(tmp){
                    depts.push(tmp.id);
                });
            });
        }
    }).then(function(){
        return new Promise(function(resolve, reject){
            staffMdl.find({'department.id':{'$in':depts}}).select('userid department').exec(function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }).then(function(users){
        var promises = [];
        users.forEach(function(user){
            promises.push(WxUser.getUserByUserId(corpid,user.userid).then(function(info){
                var tmp = {};
                tmp.department = Array.from(user.department);
                tmp.userid = user.userid;
                tmp.status = info.status;
                tmp.name = info.name;
                tmp.weixinid = info.weixinid;
                tmp.position = info.position||'';
                tmp.mobile = info.mobile;
                tmp.email = info.email||'';
                tmp.avatar = info.avatar||'';
                return Promise.resolve(tmp);
            }));
        });
        return Promise.all(promises);
    });
};

