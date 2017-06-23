var util = require('util');
var Promise = require('promise');
var DB = require('../DB');


exports.createUser = function(corpId, user) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'user').create({
            _id:user.userid,
            corp:corpId,
            name:user.name,
            department:user.department,
            departmentOfTeacher:user.departmentOfTeacher||[],
            departmentOfParent:user.departmentOfParent||[],
            mobile:user.mobile,
            status:user.status,//关注状态: 1=已关注，2=已禁用，4=未关注
            avatar:user.avatar
        }, function(err, result){
            if(err) {
                return reject(err);
            }
            var opts = [
                { path: 'corp'},
                { path: 'department'},
                { path: 'departmentOfTeacher'},
                { path: 'departmentOfParent'}
            ];

            DB.getConnection('', 'school').populate(result, opts, function (err, result) {
                if(err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    });
};

exports.updateUser = function(userid, update) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'user').findByIdAndUpdate(userid, update, {new: true}).populate('corp').populate('department')
        .exec(function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

exports.findUser = function(condition) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'user').findOne(condition).populate('corp').populate('department').populate('departmentOfParent')
        .exec(function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

/**
 * 查找部门，不区分部门或班级
 */
exports.findUserById = function(userid) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('', 'user').findById(userid).populate('corp').populate('department').exec(function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

exports.findUsersOfDepartment = function(departments) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('', 'user')
        .find({department:{'$in':departments}})
        .populate('corp')
        .populate('department')
        .populate('departmentOfTeacher')
        .populate('departmentOfParent')
        .exec(function(err, results){
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};
