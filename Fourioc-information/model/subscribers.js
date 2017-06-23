/**
 * Created by Think on 2016/8/30.
 */
var util = require('util');
var Promise = require('promise');
var DB = require('../model/DB');
var mypep_book = [
    'cdl071',
    'cdl072',
    'chx091',
    'chx092',
    'csw071',
    'csw072',
    'csw081',
    'csw082',
    'csx071',
    'csx072',
    'csx081',
    'csx082',
    'csx091',
    'csx092',
    'cwl081',
    'cwl082',
    'cwl091',
    'cyw071',
    'cyw072',
    'cyw081',
    'cyw091',
    'cyw092',
    'cyy071',
    'cyy072',
    'cyy081',
    'cyy082',
    'cyy091',
    'xsx011',
    'xsx012',
    'xsx021',
    'xsx022',
    'xsx031',
    'xsx032',
    'xsx041',
    'xsx042',
    'xsx051',
    'xsx052',
    'xsx061',
    'xsx062',
    'xyw011',
    'xyw012',
    'xyw021',
    'xyw022',
    'xyw031',
    'xyw032',
    'xyw041',
    'xyw042',
    'xyw051',
    'xyw052',
    'xyw061',
    'xyw062',
    'xyy031',
    'xyy032',
    'xyy041',
    'xyy042',
    'xyy051',
    'xyy052',
    'xyy061',
    'xyy062'
];
var mypep_table = 'mypep_subscriber';
var organization_name = 'common';
exports.createMypepSubscriber = function (corpId, userid, username, role, startTime, endTime) {
    var roles = ['invalid',
        'student',
        'teacher',
        'parent'
    ];
    if(role > 3 || role < 1){
        return Promise.reject(new Error('无效身份，只能是学生，老师或家长'));
    }
    var subscribe = {
        corpId:corpId,
        userid:userid,
        syncUserReq:{
            userInfoDTO:{
                uid:DB.objectId(),
                userName:username,
                role:role
            }
        },
        SyncOrderReq:{
            orderDTOs:[]
        }
    };
    subscribe.SyncOrderReq.orderDTOs = mypep_book.map(function (elem) {
        return {resourceType:'book', resourceId:elem, startTime:Math.round(startTime/1000), endTime:Math.round(endTime/1000)};
    });
    // console.log('save subscriber = ' + JSON.stringify(subscribe));
    return new Promise(function (resolve, reject) {
        DB.save(organization_name, mypep_table, subscribe, function (err, data) {
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};


exports.findMypepSubscriberByCorpUser = function (corpId, userid, role) {

    return new Promise(function (resolve, reject) {
        var data={}
        // DB.find(organization_name, mypep_table, {corpId:corpId, userid:userid}, function (err, data) {
        //     if(err){
        //         return reject(err);
        //     }
             return resolve(data);
        // });
    });
};

exports.findMypepSubscriberByCorpUserAndRole = function (corpId, userid, role) {

    var roles = ['invalid',
        'student',
        'teacher',
        'parent'
    ];
    if(util.isString(role)){
        role = roles.findIndex(function(elem){
            return elem === role;
        });
    }
    if(role >3 || role < 1){
        return Promise.reject(new Error('无效身份，只能是学生，老师或家长'));
    }
    return new Promise(function (resolve, reject) {
        DB.findOne(organization_name, mypep_table, {corpId:corpId, userid:userid, 'syncUserReq.userInfoDTO.role': role}, function (err, data) {
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.findMypepSubscriberByUid = function(uid){
    return new Promise(function(resolve, reject) {
        DB.findOne(organization_name, mypep_table, {'syncUserReq.userInfoDTO.uid': uid}, function(err, data) {
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.updateTimeMypepSubscriberByCorpUser = function( corpId, userid, role, startTime, endTime) {
    var SyncOrderReq = {orderDTOs:[]};
    var roles = ['invalid',
        'student',
        'teacher',
        'parent'
    ];
    if(util.isString(role)){
        role = roles.findIndex(function(elem){
            return elem === role;
        });
    }
    if(role >3 || role < 1){
        return Promise.reject(new Error('无效身份，只能是学生，老师或家长'));
    }
    SyncOrderReq.orderDTOs = mypep_book.map(function (elem) {
        return {resourceType:'book', resourceId:elem, startTime:startTime, endTime:endTime};
    });
    return new Promise(function(resolve, reject) {
        DB.updateData(organization_name, mypep_table,{corpId:corpId, userid:userid, 'syncUserReq.userInfoDTO.role': role}, {'$set':{SyncOrderReq:SyncOrderReq}}, function (err, data) {
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.updateTimeMypepSubscriberByUid = function( uid, startTime, endTime) {
    var SyncOrderReq = {orderDTOs:[]};
    SyncOrderReq.orderDTOs = mypep_book.map(function (elem) {
        return {resourceType:'book', resourceId:elem, startTime:startTime, endTime:endTime};
    });
    return new Promise(function(resolve, reject) {
        DB.updateData(organization_name, mypep_table,{'syncUserReq.userInfoDTO.uid': uid}, {'$set':{SyncOrderReq:SyncOrderReq}}, function (err, data) {
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};
