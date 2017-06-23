/**
 * Created by Think on 2016/8/3.
 */
var Promise = require('promise');
var DB = require('../DB');
var util = require('util');

exports.addSchoolManager = function (corpId, userid) {
    return new Promise(function (resolve, reject) {
        DB.findOne(corpId,'wxUser', {userid:userid},function(err, data){
            if(err){
                return reject(err);
            }
            if(util.isNullOrUndefined(data)){
                return reject(new Error('用户无效'));
            }
            return resolve();
        });
    }).then(function () {
        return new Promise(function (resolve, reject) {
            DB.save(corpId, 'school_manager',{userid:userid}, function (err, data) {
                if(err){
                    if(err.code && err.code === 11000){
                        return reject(new Error('该用户已经指定为学校管理员'));
                    }
                    return reject(err);
                }
                return resolve(data);
            });
        });
    });
};

exports.addClassManager = function (corpId, manager) {
    return new Promise(function (resolve, reject) {
        DB.findOne(corpId,'wxUser', {userid:manager.userid},function(err, data){
            if(err){
                return reject(err);
            }
            if(util.isNullOrUndefined(data)){
                return reject(new Error('用户无效'));
            }
            return resolve();
        });
    }).then(function () {
        return new Promise(function (resolve, reject) {
            DB.findOne(corpId, 'class_manager', {userid:manager.userid}, function(err, data) {
                if(err){
                    return reject(err);
                }
                if(data){
                    data.classId.push(manager.classId);
                    data.save(function(err){
                        if(err){
                            return reject(err);
                        }
                        return resolve(data);
                    });
                }else{
                    DB.save(corpId, 'class_manager', {userid:manager.userid, classId:[manager.classId]}, function (err1, dt) {
                        if(err1){
                            return reject(err1);
                        }
                        return resolve(dt);
                    });
                }
            });
        });
    });
};

exports.getSchoolManager = function (corpId) {
    return new Promise(function( resolve, reject ){
        DB.find(corpId,'school_manager',{},{}, function(err, datas){
            if(err){
                return reject(err);
            }
            return resolve(datas);
        });
    });
};

exports.getClassManagerByClassId = function(corpId, classId) {
    return new Promise(function( resolve, reject) {
        DB.find(corpId,'class_manager',{classId:classId},{}, function(err, datas){
            if(err){
                return reject(err);
            }
            return resolve(datas);
        });
    });
};
